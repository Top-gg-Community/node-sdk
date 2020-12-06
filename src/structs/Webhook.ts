import getBody from 'raw-body'
import qs from 'querystring'
import { EventEmitter } from 'events'

interface WebhookEvents {
  botVote: [BotVote]
  guildVote: [GuildVote]
}

export interface Webhook {
  on<K extends keyof WebhookEvents>(event: K, listener: (...args: WebhookEvents[K]) => void): this;
}

/**
 * Top.gg Webhook
 * @example
 * const express = require('express')
 * const { Webhook } = require(`@top-gg/sdk`)
 * 
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 * 
 * app.post('/dblwebhook', wh.attach())
 * 
 * wh.on('botVote', (vote) => { // when a user votes for a bot
 *   console.log(vote.user) // => 321714991050784770
 * })
 * 
 * wh.on('guildVote', (vote) => { // when a user votes for a server
 *   console.log(vote.guild) // => 264445053596991498
 * })
 * 
 * app.listen(80)
 * 
 * // In this situation, your TopGG Webhook dashboard should look like
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
 */
export class Webhook extends EventEmitter {
  private auth: string

  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor (authorization?: string) {
    super()
    this.auth = authorization
  }

  private _parseRequest (req, res): Promise<WebhookPayload|false> {
    return new Promise(resolve => {
      if (this.auth && req.headers.authorization !== this.auth) return res.status(403).json({ error: 'Unauthorized', from: 'topggjs' })
      // parse json

      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: 'Malformed request', from: 'topggjs' })

        try {
          const parsed = JSON.parse(body.toString('utf8'))

          if (parsed?.query?.length > 0) parsed.query = qs.parse(parsed.query.substr(1))

          resolve(parsed)
        } catch (err) {
          res.status(400).json({ error: 'Invalid body', from: 'topggjs' })
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

  public attach () {
    return async (req, res) => {
      const response = await this._parseRequest(req, res)
      if (!response) return

      /**
       * Emitted when a bot is voted for
       * @event botVote
       * @param vote Vote object
       */
      if (response.bot && ['test', 'upvote'].includes(response.type)) return this.emit('botVote', response)
      /**
       * Emitted when a server is voted for
       * @event guildVote
       * @param vote Vote object
       */
      if (response.guild && ['test', 'upvote'].includes(response.type)) return this.emit('guildVote', response)
    }
  }
}