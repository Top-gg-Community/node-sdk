import fetch, { Headers } from 'node-fetch'
import APIError from '../utils/APIError'
import ClientUtils, { ClientType } from '../utils/ClientUtils'
import qs from 'querystring'
import '../typings'
import { EventEmitter } from 'events'

interface APIOptions {
  /**
   * Top.GG Token
   */
  token: any
  /**
   * Interval at which to post in milliseconds
   * @default 1800000 30 minutes
   */
  interval?: number
  /**
   * Whether or not to autopost
   * @default true
   */
  autoPost?: boolean
  /**
   * Whether or not in testing phase (devs only)
   */
  debug?: boolean
}

/**
 * Top.GG API Client for Posting stats or Fetching data
 * @link https://top.gg/api/docs
 * @example
 * ```js
 * const client = Discord.Client() // Your discord.js or Eris client
 *
 * const TopGG = require('@top-gg/sdk')
 *
 * const api = new TopGG.API('Your top.gg token', client)
 *
 * api.on('posted', () => {
 *   console.log('Server count posted!')
 * })
 * ```
 */
export default class API extends EventEmitter {
  private options: APIOptions
  private client: any
  private clientType: ClientType
  /**
   * Create Top.GG API instance
   * @param token Token or options
   * @param client Supported library client 
   */
  constructor (token?: string|APIOptions, client?: any) {
    super()
    const defaultOptions = {
      interval: 1800000,
      autoPost: true,
      debug: false
    }
    if (!token || typeof token === 'string') {
      this.options = {
        token,
        ...defaultOptions
      }
    } else {
      this.options = {
        ...defaultOptions,
        ...token
      }
    }

    if (this.options.interval < 900000) throw new Error('Interval can not be lower than 900000 (15 minutes)')

    this.client = client 
    this.clientType = ClientUtils.figureClient(client)

    if (this.options.debug) console.debug(`[DEBUG] Client Type: ${this.clientType}`)

    if (this.options.autoPost && client) ClientUtils.setupAutoPoster(client, this.clientType, () => {
      this.postStats()

      setInterval(() => {
        if (ClientUtils.isStarted(client, this.clientType)) this.postStats()
      }, this.options.interval)
    })
  }

  private async _request (method: string, path: string, body?: object): Promise<any> {
    const headers = new Headers()
    if (this.options.token) headers.set('Authorization', this.options.token)
    if (method !== 'GET') headers.set('Content-Type', 'application/json')

    let url = `https://top.gg/api/${path}`

    // @ts-ignore querystring typings are messed
    if (body && method === 'GET') url += `?${qs.stringify(body)}`

    if (this.options.debug) {
      console.debug(`[DEBUG] ${method} ${path}: ${JSON.stringify(body)}`)

      return {
        test: true
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : null
    })

    const responseBody = response.headers.get('Content-Type')?.startsWith('application/json') ? await response.json() : await response.text()

    if (!response.ok) throw new APIError(response.status, response.statusText, responseBody)

    return responseBody
  }

  /**
   * Post bot stats to Top.GG (Do not use if you supplied a client)
   * @param serverCount Server count
   * @param shardId Current shard ID
   * @param shardCount Total shard count
   * @example
   * ```js
   * await client.postStats(28199, null, 1)
   * ```
   */
  public async postStats (serverCount?: number, shardId?: number, shardCount?: number) {
    if (!serverCount && !this.clientType) throw new Error('Missing Server Count or Client')
    const data = {
      server_count: serverCount ?? ClientUtils.serverCount(this.client, this.clientType),
      shard_id: shardId ?? ClientUtils.currentShard(this.client, this.clientType),
      shard_count: shardCount ?? ClientUtils.shardCount(this.client, this.clientType)
    }

    /**
     * Event when the bot posts it's stats
     * @event posted
     * @param serverCount Posted server count
     * @param shardId Posted shard ID
     * @param shardCount Posted shard count
     */
    this._request('POST', '/bots/stats', data)
      .then(() => this.emit('posted', data.server_count, data.shard_id, data.shard_count))
      .catch(err => console.error(err))
  } 

  /**
   * Get a bots stats
   * @param id Bot ID
   * @example
   * ```js
   * await client.getStats() // gives self
   * await client.getStats('461521980492087297')
   * // =>
   * {
   *   server_count: 28199,
   *   shard_count 1,
   *   shards: []
   * }
   * ```
   */
  public async getStats (id: Snowflake): Promise<BotStats> {
    if (!id && !this.clientType) throw new Error('ID or Client missing')
    return this._request('GET', `/bots/${id ?? ClientUtils.id(this.client, this.clientType)}/stats`)
  }

  /**
   * Get bot info
   * @param id Bot ID
   * @example
   * ```js
   * await client.getBot() // returns self
   * await client.getBot('461521980492087297') // returns other bot
   * ```
   */
  public async getBot (id: Snowflake): Promise<BotInfo> {
    if (!id && !this.clientType) throw new Error('ID Missing')
    return this._request('GET', `/bots/${id ?? ClientUtils.id(this.client, this.clientType)}`)
  }

  /**
   * Get user info
   * @param id User ID
   * @example
   * ```js
   * await client.getUser('205680187394752512')
   * // =>
   * user.username // Xignotic
   * ```
   */
  public async getUser (id: Snowflake): Promise<UserInfo> {
    if (!id) throw new Error('ID Missing')
    return this._request('GET', `/users/${id}`)
  }

  /**
   * Get a list of bots
   * @param query Bot Query
   * @example
   * ```js
   * // Finding by properties
   * await client.getBots({
   *   search: {
   *     username: 'shiro',
   *     certifiedBot: true
   *     ...any other bot object properties
   *   }
   * })
   * // =>
   * {
   *   results: [
   *     {
   *       id: '461521980492087297',
   *       username: 'Shiro',
   *       discriminator: '8764',
   *       lib: 'discord.js',
   *       ...rest of bot object
   *     }
   *     ...other shiro knockoffs B)
   *   ],
   *   limit: 10,
   *   offset: 0,
   *   count: 1,
   *   total: 1
   * }
   * // Restricting fields
   * await client.getBots({
   *   fields: ['id', 'username']
   * })
   * // =>
   * {
   *   results: [
   *     {
   *       id: '461521980492087297',
   *       username: 'Shiro'
   *     },
   *     {
   *       id: '493716749342998541',
   *       username: 'Mimu'
   *     },
   *     ...
   *   ],
   *   ...
   * }
   * ```
   */
  public async getBots (query?: BotsQuery): Promise<BotsResponse> {
    if (query) {
      if (query.fields instanceof Array) query.fields = query.fields.join(', ')
      if (query.search instanceof Object) {
        query.search = Object.keys(query.search)
          .map(key => `${key}: ${query.search[key]}`).join(' ')
      }
    }
    return this._request('GET', '/bots', query)
  }

  /**
   * Get users who've voted
   * @example
   * ```js
   * await client.getVotes()
   * // => 
   * [
   *   {
   *     username: 'Xignotic',
   *     discriminator: '0001',
   *     id: '205680187394752512',
   *     avatar: '3b9335670c7213b3a2d4e990081900c7'
   *   },
   *   {
   *     username: 'iara',
   *     discriminator: '0001',
   *     id: '395526710101278721',
   *     avatar: '3d1477390b8d7c3cec717ac5c778f5f4'
   *   }
   *   ...more
   * ]
   * ```
   */
  public async getVotes (): Promise<Array<ShortUser>> {
    if (!this.options.token) throw new Error('Missing token')
    return this._request('GET', '/bots/votes')
  }

  /**
   * Get whether or not a user has voted
   * @param id User ID
   * @example
   * ```js
   * await client.hasVoted('205680187394752512')
   * // => true/false
   * ```
   */
  public async hasVoted(id: Snowflake): Promise<boolean> {
    if (!id) throw new Error('Missing ID')
    return this._request('GET', '/bots/check', { userId: id }).then(x => !!x.voted)
  }

  /**
   * Whether or not the weekend multiplier is active
   * @example
   * ```js
   * await client.hasVoted()
   * // => true/false
   * ```
   */
  public async isWeekend (): Promise<boolean> {
    return this._request('GET', '/weekend').then(x => x.is_weekend)
  }
}