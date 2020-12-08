import getBody from 'raw-body'
import qs from 'querystring'

/**
 * Top.gg Webhook
 * @example
 * const express = require('express')
 * const { Webhook } = require(`@top-gg/sdk`)
 * 
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 * 
 * app.post('/dblwebhook', wh.middleware(), (req, res) => {
 *   // req.vote is your vote object e.g
 *   console.log(req.vote.user) // => 321714991050784770
 * })
 * 
 * app.listen(80)
 * 
 * // In this situation, your TopGG Webhook dashboard should look like
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
 */
export class Webhook {
  private auth: string

  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor (authorization?: string) {
    this.auth = authorization
  }

  private _parseRequest (req, res): Promise<WebhookPayload|false> {
    return new Promise(resolve => {
      if (this.auth && req.headers.authorization !== this.auth) return res.status(403).json({ error: 'Unauthorized' })
      // parse json

      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: 'Malformed request' })

        try {
          const parsed = JSON.parse(body.toString('utf8'))

          if (parsed?.query?.length > 0) parsed.query = qs.parse(parsed.query.substr(1))

          resolve(parsed)
        } catch (err) {
          res.status(400).json({ error: 'Invalid body' })
          resolve(false)
        }
      })
    })
  }

  /**
   * Middleware function to pass to express, sets req.vote to the payload
   * @example
   * app.post('/dblwebhook', wh.middleware(), (req, res) => {
   *   // req.vote is your payload e.g
   *   console.log(req.vote.user) // => 395526710101278721
   * })
   */
  public middleware () {
    return async (req, res, next) => {
      const response = await this._parseRequest(req, res)
      if (!response) return
      req.vote = response
      next()
    }
  }
}