const tips = {
  401: "You need a token for this endpoint",
  403: "You don't have access to this endpoint",
};

/**
 * API Error
 */
export default class TopGGAPIError extends Error {
  constructor(code: number, text: string) {
    if (code in tips) {
      super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
    } else {
      super(`${code} ${text}`);
    }
  }
}
