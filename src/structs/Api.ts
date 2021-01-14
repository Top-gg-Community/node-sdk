import fetch, { Headers } from 'node-fetch'
import ApiError from '../utils/ApiError'
import qs from 'querystring'
import { EventEmitter } from 'events'

interface APIOptions {
  /**
   * Top.gg Token
   */
  token: any
}

/**
 * Top.gg API Client for Posting stats or Fetching data
 * @link https://top.gg/api/docs
 * @example
 * const Topgg = require(`@top-gg/sdk`)
 *
 * const api = new Topgg.Api('Your top.gg token')
 */
export class Api extends EventEmitter {
  private options: APIOptions
  /**
   * Create Top.gg API instance
   * @param {string} token Token or options
   * @param {object?} options API Options 
   */
  constructor (token: string, options?: APIOptions) {
    super()
    this.options = {
      token: token
    }
  }

  private async _request (method: string, path: string, body?: object): Promise<any> {
    const headers = new Headers()
    if (this.options.token) headers.set('Authorization', this.options.token)
    if (method !== 'GET') headers.set('Content-Type', 'application/json')

    let url = `https://top.gg/api/${path}`

    // @ts-ignore querystring typings are messed
    if (body && method === 'GET') url += `?${qs.stringify(body)}`

    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : null
    })

    let responseBody 
    if (response.headers.get('Content-Type')?.startsWith('application/json')) {
      responseBody = await response.json()
    } else {
      responseBody = await response.text()
    }

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, responseBody)
    }

    return responseBody
  }

  private _isNumberArray(arr: any) {
    return Array.isArray(arr) && arr.every(e => typeof e === 'number')
  }

  /**
   * Post bot stats to Top.gg (Do not use if you supplied a client)
   * @param {Object} stats Stats object
   * @param {number} stats.serverCount Server count
   * @param {number?} stats.shardCount Shard count
   * @param {number?} stats.shardId Posting shard (useful for process sharding)
   * @returns {BotStats} Passed object
   * @example
   * await client.postStats({
   *   serverCount: 28199, 
   *   shardCount: 1
   * })
   */
  public async postStats (stats: BotStats): Promise<BotStats> {
    if (!stats || !stats.serverCount) throw new Error('Missing Server Count')

    if (typeof stats.serverCount !== 'number' && !this._isNumberArray(stats.serverCount))
      throw new TypeError('Expected stats.serverCount to be a number or array of numbers')
    
    if (stats.shardId && typeof stats.shardId !== 'number')
      throw new TypeError('Expected stats.shardId to be a number')
    
    if (stats.shardCount && typeof stats.shardCount !== 'number')
      throw new TypeError('Expected stats.shardCount to be a number')

    await this._request('POST', '/bots/stats', {
      server_count: stats.serverCount,
      shard_id: stats.shardId,
      shard_count: stats.shardCount
    })

    return stats
  } 

  /**
   * Get a bots stats
   * @param {Snowflake} id Bot ID
   * @returns {BotStats} Stats of bot requested
   * @example
   * await client.getStats('461521980492087297')
   * // =>
   * {
   *   serverCount: 28199,
   *   shardCount 1,
   *   shards: []
   * }
   */
  public async getStats (id: Snowflake): Promise<BotStats> {
    if (!id) throw new Error('ID missing')
    if (typeof id !== 'string')
      throw new TypeError('Expected id to be a Snowflake/string')

    const result = await this._request('GET', `/bots/${id}/stats`)
    return {
      serverCount: result.server_count,
      shardCount: result.shard_count,
      shards: result.shards
    }
  }

  /**
   * Get bot info
   * @param {Snowflake} id Bot ID
   * @returns {BotInfo} Info for bot
   * @example
   * await client.getBot('461521980492087297') // returns bot info
   */
  public async getBot (id: Snowflake): Promise<BotInfo> {
    if (!id) throw new Error('ID Missing')
    if (typeof id !== 'string')
      throw new TypeError('Expected id to be a Snowflake/string')
    
    return this._request('GET', `/bots/${id}`)
  }

  /**
   * Get user info
   * @param {Snowflake} id User ID
   * @returns {UserInfo} Info for user
   * @example
   * await client.getUser('205680187394752512')
   * // =>
   * user.username // Xignotic
   */
  public async getUser (id: Snowflake): Promise<UserInfo> {
    if (!id) throw new Error('ID Missing')
    if (typeof id !== 'string')
      throw new TypeError('Expected id to be a Snowflake/string')
    
    return this._request('GET', `/users/${id}`)
  }

  /**
   * Get a list of bots
   * @param {BotsQuery} query Bot Query
   * @returns {BotsResponse} Return response
   * @example
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
   */
  public async getBots (query?: BotsQuery): Promise<BotsResponse> {
    if (query) {
      if (query.fields instanceof Array) query.fields = query.fields.join(', ')
      if (query.search instanceof Object) {
        query.search = Object.entries(query.search)
          .map(([key, value]) => `${key}: ${value}`).join(' ')
      }
    }
    return this._request('GET', '/bots', query)
  }

  /**
   * Get users who've voted
   * @returns {ShortUser[]} Array of users who've voted
   * @example
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
   */
  public async getVotes (): Promise<ShortUser[]> {
    if (!this.options.token) throw new Error('Missing token')
    return this._request('GET', '/bots/votes')
  }

  /**
   * Get whether or not a user has voted
   * @param {Snowflake} id User ID
   * @returns {Boolean} Whether the user has voted
   * @example
   * await client.hasVoted('205680187394752512')
   * // => true/false
   */
  public async hasVoted(id: Snowflake): Promise<boolean> {
    if (!id) throw new Error('Missing ID')
    if (typeof id !== 'string')
      throw new TypeError('Expected id to be a Snowflake/string')
    
    return this._request('GET', '/bots/check', { userId: id }).then(x => !!x.voted)
  }

  /**
   * Whether or not the weekend multiplier is active
   * @returns {Boolean} Whether the the multiplier is active
   * @example
   * await client.isWeekend()
   * // => true/false
   */
  public async isWeekend (): Promise<boolean> {
    return this._request('GET', '/weekend').then(x => x.is_weekend)
  }
}