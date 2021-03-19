import getBody from 'raw-body'
import qs from 'querystring'

import { WebhookPayload } from '../typings'

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
  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor (private authorization?: string) {}

  private _formatIncoming (body): WebhookPayload {
    if (body?.query?.length > 0) body.query = qs.parse(body.query.substr(1))
    return body
  }

  private _parseRequest (req, res): Promise<WebhookPayload|false> {
    return new Promise(resolve => {
      if (this.authorization && req.headers.authorization !== this.authorization) return res.status(403).json({ error: 'Unauthorized' })
      // parse json

      if (req.body) return resolve(this._formatIncoming(req.body))
      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: 'Malformed request' })

        try {
          const parsed = JSON.parse(body.toString('utf8'))

          resolve(this._formatIncoming(parsed))
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
      res.sendStatus(204)
      req.vote = response
      next()
    }
  }
}
