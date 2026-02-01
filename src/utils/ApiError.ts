import type { Dispatcher } from "undici";

const tips = {
  401: "You need a token for this endpoint",
  403: "You don't have access to this endpoint",
};

/** API Error */
export default class TopGGAPIError extends Error {
  /** Possible response from Request */
  public response?: Dispatcher.ResponseData;
  constructor(code: number, text: string, response: Dispatcher.ResponseData) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }
    this.response = response;
  }
}
