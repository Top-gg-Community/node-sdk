const tips = {
  401: "You need a token for this endpoint",
  403: "You don't have access to this endpoint",
};

/** API Error */
export default class APIError extends Error {
  /** Response status code */
  public statusCode: number;

  /** Possible response body from Response */
  public body?: string | object;

  constructor(code: number, text: string, body?: string | object) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }

    this.statusCode = code;
    this.message = tips[code as keyof typeof tips] ?? text;
    this.body = body;
  }
}
