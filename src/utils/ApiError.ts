const tips = {
  400: "Attempted to send an invalid request to the API",
  401: "Invalid Top.gg API token",
  403: "You don't have access to this endpoint",
  404: "Route not found",
  429: "The client is blocked by the API. Please try again in a few moments",
  500: "Received an unexpected error from Top.gg's end"
};

/** API Error */
export default class TopGGAPIError extends Error {
  /** The response from the request */
  public response: Response;
  constructor(text: string, response: Response) {
    if (response.status in tips) {
      super(
        `${response.status} ${text} (${tips[response.status as keyof typeof tips]})`
      );
      /* node:coverage ignore next 3 */
    } else {
      super(`${response.status} ${text}`);
    }
    this.name = "TopGGAPIError";
    this.response = response;
  }
}
