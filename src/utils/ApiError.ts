import type { Dispatcher } from "undici";

const tips = {
  401: "You need a token for this endpoint",
  403: "You don't have access to this endpoint",
};

/**
 * Represents a Top.gg API error
 * @extends Error
 */
export default class TopGGAPIError extends Error {
  /** Possible response from Request */
  public response?: Dispatcher.ResponseData;

  /**
   * Creates a Top.gg API error instance
   * 
   * @param {number} code The error code
   * @param {string} text The error text
   * @param {Dispatcher.ResponseData} response 
   */
  constructor(code: number, text: string, response: Dispatcher.ResponseData) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }
    this.response = response;
  }
}