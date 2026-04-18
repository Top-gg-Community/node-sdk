import type { MockInterceptor } from "undici/types/mock-interceptor";
import { MOCK_TOKEN, MOCK_WEBHOOK_SECRET } from "./data";
import { MockAgent, setGlobalDispatcher } from "undici";
import { endpoints } from "./endpoints";
import { API_VERSION } from "../../src";
import crypto from "node:crypto";

export interface MockResponse {
  statusCode: number;
  data?: string | object | Buffer<ArrayBufferLike> | undefined;
  responseOptions?: MockInterceptor.MockResponseOptions;
}

export function getIdInPath(pattern: string, url: string) {
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, "([^/]+)")}$`);
  const match = url.split("?")[0].match(regex);

  return match ? match[1] : null;
}

export function isMatchingPath(pattern: string, url: string) {
  // Remove query params
  url = url.split("?")[0];

  return (
    pattern === url ||
    (!endpoints.some(({ pattern }) => pattern === url) &&
      getIdInPath(pattern, url) !== null)
  );
}

export function signature(body: Buffer, date: Date = new Date()) {
  const timestamp = Math.floor(date.getTime() / 1000);

  const hmac = crypto.createHmac("sha256", MOCK_WEBHOOK_SECRET);
  const signature = hmac
    .update(`${timestamp}.${body.toString("utf-8")}`)
    .digest("hex");

  return `t=${timestamp},${API_VERSION}=${signature}`;
}

export function registerMocks() {
  const mockAgent = new MockAgent();

  mockAgent.disableNetConnect();

  const client = mockAgent.get("https://top.gg");

  endpoints.forEach(({ pattern, method, data, validate }) => {
    client
      .intercept({
        path: (path) => isMatchingPath(pattern, path),
        method
      })
      .reply((request) => {
        const headers = new Headers(request.headers as any);

        if (request.method !== method) {
          return {
            statusCode: 405
          };
        } else if (headers.get("authorization") !== `Bearer ${MOCK_TOKEN}`) {
          return {
            statusCode: 401
          };
        }

        return (
          validate?.(request) ?? {
            statusCode: 200,
            data: typeof data === "string" ? data : JSON.stringify(data),
            responseOptions: {
              headers: {
                "content-type":
                  typeof data === "string" ? "text/html" : "application/json"
              }
            }
          }
        );
      })
      .persist();
  });

  client
    .intercept({
      path: (path) =>
        !endpoints.some(({ pattern }) => isMatchingPath(pattern, path)),
      method: (_) => true
    })
    .reply((request) => {
      throw Error(`No endpoint found for ${request.method} ${request.path}`);
    })
    .persist();

  setGlobalDispatcher(mockAgent);
}
