const tips = {
  401: 'You need a token for this endpoint',
  403: 'You don\'t have access to this endpoint'
}

/**
 * API Error
 */
export default class TopGGAPIError extends Error {
  /**
   * Possible response from Request
   */
  public response?: any

  name = 'Top.GG API Error'

  constructor (code: number, text: string, response?: any) {
    super(`${code} ${text}${tips[code] ? ` (${tips[code]})` : ''}`)

    this.response = response
  }
}