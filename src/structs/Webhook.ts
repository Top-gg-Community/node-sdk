import { EventEmitter } from 'events'
import getBody from 'raw-body'
import '../typings'
import qs from 'querystring'

export default interface Webhook {
  on(event: 'vote', listener: (vote: Vote) => void): this
}

/**
 * Top.GG Webhook
 * @extends EventEmitter
 * @example
 * ```js
 * const express = require('express')
 * const { Webhook } = require('@top-gg/sdk')
 * 
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 * 
 * app.post('/dblwebhook', wh.middleware())
 * 
 * wh.on('vote', (vote) => {
 *   vote.user
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
export default class Webhook extends EventEmitter {
  private auth: string

  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor (authorization) {
    super()

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

    /**
     * Emitted when a user votes
     * @event vote
     * @param {Vote} vote
     */
    this.emit('vote', body)

    res.status(200).json({ success: true, from: 'topggjs' })
  }

  /**
   * Middleware function to pass to express
   * @param opts Options
   * @param {boolean} [opts.next=true] Whether or not to continue next() request
   */
  public middleware (opts?) {
    const options = {
      next: true,
      ...opts
    }
    return (req, res, next) => {
      this._handlePost(req, res)
      if (options.next) next()
    }
  }
}