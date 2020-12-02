import getBody from 'raw-body'
import qs from 'querystring'

/**
 * Top.gg Webhook
 * @example
 * ```js
 * const express = require('express')
 * const { Webhook } = require('@top-gg/sdk')
 * 
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 * 
 * app.post('/dblwebhook', wh.middleware(), (req, res) => {
 *   req.vote.user
 *   // => 321714991050784770
 * })
 * 
 * app.listen(80)
 * 
 * // In this situation, your TopGG Webhook dashboard should look like
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
 * ```
 */
export class Webhook {
  private auth: string

  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor (authorization) {
    this.auth = authorization
  }

  private _verifyRequest (req, res): Promise<Vote|false> {
    return new Promise(resolve => {
      if (this.auth && req.headers.authorization !== this.auth) return res.status(403).json({ error: 'Unauthorized', from: 'topggjs' })
      // parse json

      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: 'Malformed request', from: 'topggjs' })

        try {
          const parsed = JSON.parse(body.toString('utf8'))
          resolve(parsed)
        } catch (err) {
          res.status(400).json({ error: 'Invalid body', from: 'topggjs' })
          resolve(false)
        }
      })
    })
  }

  private async _handlePost (req, res) {
    const body = await this._verifyRequest(req, res)
    if (!body) return

    // @ts-ignore querystring typings are messed
    if (body?.query?.length > 0) body.query = qs.parse(body.query.substr(1))

    req.vote = body
  }

  /**
   * Middleware function to pass to express
   */
  public middleware () {
    return async (req, res, next) => {
      await this._handlePost(req, res)
      next()
    }
  }
}