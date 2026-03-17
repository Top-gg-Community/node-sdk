import { deepStrictEqual, strictEqual } from "node:assert";
import { it, describe } from "node:test";
import { Readable } from "node:stream";

import {
  INTEGRATION_CREATE_PAYLOAD,
  MOCK_WEBHOOK_SECRET,
  MOCK_WEBHOOK_TRACE,
  PAYLOADS
} from "./mocks/data";
import httpMocks from "node-mocks-http";
import type { Request } from "express";
import { Webhook } from "../src/index";
import { signature } from "./mocks";

const webhook = new Webhook(MOCK_WEBHOOK_SECRET);
const listener = webhook.listener((payload, _, response) => {
  response.status(200).json({
    type: payload.type,
    trace: payload.trace
  });
});

describe("Webhook error handling test", () => {
  it("Listener should timeout when content-length is wrong", async () => {
    const request = Object.assign(new Readable({ read() {} }), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "2"
      }
    });

    const response = httpMocks.createResponse();

    await listener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 400);
    deepStrictEqual(response._getJSONData(), {
      error: "Malformed request"
    });
  });

  it("Listener should return 401 when x-topgg-signature is not specified", async () => {
    const request = Object.assign(Readable.from([Buffer.allocUnsafe(0)]), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "0"
      }
    });

    const response = httpMocks.createResponse();

    await listener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 401);
    deepStrictEqual(response._getJSONData(), {
      error: "Missing signature"
    });
  });

  it("Listener should return 422 when x-topgg-signature is not in the valid format", async () => {
    const request = Object.assign(Readable.from([Buffer.allocUnsafe(0)]), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "0",
        "x-topgg-signature": "test"
      }
    });

    const response = httpMocks.createResponse();

    await listener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 422);
    deepStrictEqual(response._getJSONData(), {
      error: "Invalid signature format"
    });
  });

  it("Listener should return 403 when x-topgg-signature does not match", async () => {
    const body = Buffer.from("test");
    const request = Object.assign(Readable.from([body]), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
        "x-topgg-signature": signature(Buffer.from("test2")),
        "x-topgg-trace": MOCK_WEBHOOK_TRACE
      }
    });

    const response = httpMocks.createResponse();

    await listener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 403);
    deepStrictEqual(response._getJSONData(), {
      error: "Invalid signature"
    });
  });

  it("Listener should return 500 when an exception is thrown", async () => {
    const faultyListener = webhook.listener(() => {
      throw new Error("test");
    });

    const body = Buffer.from(JSON.stringify(INTEGRATION_CREATE_PAYLOAD));
    const request = Object.assign(Readable.from([body]), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
        "x-topgg-signature": signature(body),
        "x-topgg-trace": MOCK_WEBHOOK_TRACE
      }
    });

    const response = httpMocks.createResponse();

    await faultyListener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 500);
  });

  it("Listener should return 204 when the body is not a valid JSON", async () => {
    const body = Buffer.from(
      JSON.stringify({
        type: "asdfghjkl"
      })
    );
    const request = Object.assign(Readable.from([body]), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
        "x-topgg-signature": signature(body),
        "x-topgg-trace": MOCK_WEBHOOK_TRACE
      }
    });

    const response = httpMocks.createResponse();

    await listener(request as any, response, () => {});

    strictEqual(response._getStatusCode(), 204);
  });
});

describe("Webhook payload test", () => {
  for (const payload of PAYLOADS) {
    it(`${payload.type} payload handling should work`, async () => {
      const body = Buffer.from(JSON.stringify(payload));
      const request = Object.assign(Readable.from([body]), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body).toString(),
          "x-topgg-signature": signature(body),
          "x-topgg-trace": MOCK_WEBHOOK_TRACE
        }
      });

      const response = httpMocks.createResponse();

      await listener(request as any, response, () => {});

      strictEqual(response._getStatusCode(), 200);
      deepStrictEqual(response._getJSONData(), {
        type: payload.type,
        trace: MOCK_WEBHOOK_TRACE
      });
    });
  }
});
