const tips = {
  401: "You need a token for this endpoint",
  403: "You don't have access to this endpoint",
};

/**
 * API Error
 */
export default class TopGGAPIError extends Error {
  /**
   * Possible response from Request
   */
  public response?: any;

  name = "Top.GG API Error";

  // @ts-ignore typescript needs `super` to be the first thing in a class for absolutely no reason
  constructor(code: number, text: string, response?: Response) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }
  }
}
