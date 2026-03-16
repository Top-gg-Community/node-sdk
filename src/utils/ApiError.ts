const tips = {
  400: "Attempted to send an invalid request to the API",
  401: "Invalid Top.gg API token",
  403: "You don't have access to this endpoint",
  404: "Such query does not exist",
  429: "The client is blocked by the API. Please try again in a few moments",
  500: "Received an unexpected error from Top.gg's end"
};

/** API Error */
export default class TopGGAPIError extends Error {
  /** Possible response from the request */
  public response?: Response;
  constructor(code: number, text: string, response: Response) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }
    this.response = response;
  }
}
