import { MockInterceptor } from "undici/types/mock-interceptor";
import { RAW_PAGINATED_VOTES, RAW_PARTIAL_VOTE, RAW_PROJECT } from "./data";
import { getIdInPath } from "../jest.setup";

export const endpoints = [
  {
    pattern: "/api/v1/projects/@me",
    method: "GET",
    data: RAW_PROJECT
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
      if (Number(user_id) === 0) return { statusCode: 404 };
      return null;
    }
  },
  {
    pattern: "/api/v1/projects/@me/commands",
    method: "POST",
    data: {}
  },
  {
    pattern: "/api/v1/projects/@me/votes",
    method: "GET",
    data: RAW_PAGINATED_VOTES
  }
];
