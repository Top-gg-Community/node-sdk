import {
  RAW_ANNOUNCEMENT,
  RAW_METRIC,
  RAW_METRIC_BATCH,
  RAW_PAGINATED_VOTES,
  RAW_PARTIAL_VOTE,
  RAW_PROJECT,
  RAW_PROJECT_PAYLOAD
} from "./data";
import type { MockInterceptor } from "undici/types/mock-interceptor";
import { getIdInPath, type MockResponse } from "./index";
import { Method } from "../../src";

interface MockEndpoint {
  pattern: string;
  method: Method;
  data: any;
  validate?: (
    request: MockInterceptor.MockResponseCallbackOptions
  ) => MockResponse | null;
}

export const endpoints: MockEndpoint[] = [
  {
    pattern: "/api/v1/projects/@me",
    method: "GET",
    data: RAW_PROJECT
  },
  {
    pattern: "/api/v1/projects/@me",
    method: "PATCH",
    data: RAW_PROJECT_PAYLOAD
  },
  {
    pattern: "/api/v1/projects/@me/votes/:user_id",
    method: "GET",
    data: RAW_PARTIAL_VOTE,
    validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
      const user_id = getIdInPath(
        "/api/v1/projects/@me/votes/:user_id",
        request.path
      );
      return user_id && parseInt(user_id, 10) === 0
        ? { statusCode: 404 }
        : null;
    }
  },
  {
    pattern: "/api/v1/projects/@me/commands",
    method: "PUT",
    data: ""
  },
  {
    pattern: "/api/v1/projects/@me/announcements",
    method: "POST",
    data: RAW_ANNOUNCEMENT
  },
  {
    pattern: "/api/v1/projects/@me/metrics",
    method: "PATCH",
    data: RAW_METRIC
  },
  {
    pattern: "/api/v1/projects/@me/metrics/batch",
    method: "POST",
    data: RAW_METRIC_BATCH
  },
  {
    pattern: "/api/v1/projects/@me/votes",
    method: "GET",
    data: RAW_PAGINATED_VOTES
  }
];
