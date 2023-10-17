import { request, type Dispatcher } from "undici";
import type { IncomingHttpHeaders } from "undici/types/header";
import ApiError from "../utils/ApiError";
import { EventEmitter } from "events";
import { STATUS_CODES } from "http";

import {
  APIOptions,
  Snowflake,
  BotStats,
  BotInfo,
  UserInfo,
  BotsResponse,
  ShortUser,
  BotsQuery,
} from "../typings";

/**
 * Top.gg API Client for posting stats or fetching data
 *
 * @example
 * ```js
 * const Topgg = require("@top-gg/sdk");
 *
 * const api = new Topgg.Api("Your top.gg token");
 * ```
 *
 * @link {@link https://topgg.js.org | Library docs}
 * @link {@link https://docs.top.gg | API Reference}
 */
export class Api extends EventEmitter {
  private options: APIOptions;
  /**
   * Create Top.gg API instance
   *
   * @param {string} token Token or options
   * @param {APIOptions} [options] API Options
   */
  constructor(token: string, options: APIOptions = {}) {
    super();
    this.options = {
      token: token,
      ...options,
    };
  }

  private async _request(
    method: Dispatcher.HttpMethod,
    path: string,
    body?: Record<string, any>
  ): Promise<any> {
    const headers: IncomingHttpHeaders = {};
    if (this.options.token) headers["authorization"] = this.options.token;
    if (method !== "GET") headers["content-type"] = "application/json";

    let url = `https://top.gg/api${path}`;

    if (body && method === "GET") url += `?${new URLSearchParams(body)}`;

    const response = await request(url, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });

    let responseBody;
    if (
      (response.headers["content-type"] as string)?.startsWith(
        "application/json"
      )
    ) {
      responseBody = await response.body.json();
    } else {
      responseBody = await response.body.text();
    }

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new ApiError(
        response.statusCode,
        STATUS_CODES[response.statusCode] ?? "",
        response
      );
    }

    return responseBody;
  }

  /**
   * Posts bot stats to Top.gg
   *
   * @example
   * ```js
   * await api.postStats({
   *   serverCount: 28199,
   *   shardCount: 1,
   * });
   * ```
   *
   * @param {BotStats} stats Stats object
   * @param {number} [stats.serverCount] The amount of servers the bot is in
   * @param {number} [stats.shards] The amount of servers the bot is in per shard.
   * @param {number} [stats.shardCount] The amount of shards a bot has
   * @param {number} [stats.shardId] Posting shard (useful for process sharding)
   * @returns {Promise<BotStats>} Passed object
   */
  public async postStats(stats: BotStats): Promise<BotStats> {
    if (!stats?.serverCount) throw new Error("Missing Server Count");

    /* eslint-disable camelcase */
    await this._request("POST", "/bots/stats", {
      server_count: stats.serverCount,
      shard_id: stats.shardId,
      shard_count: stats.shardCount,
    });
    /* eslint-enable camelcase */

    return stats;
  }

  /**
   * Get a bots stats
   *
   * @example
   * ```js
   * await api.getStats("461521980492087297");
   * // =>
   * {
   *   serverCount: 28199,
   *   shardCount 1,
   *   shards: []
   * }
   * ```
   *
   * @param {Snowflake} id Bot ID
   * @returns {Promise<BotStats>} Stats of bot requested
   */
  public async getStats(id: Snowflake): Promise<BotStats> {
    if (!id) throw new Error("Missing parameter bot ID");
    const result = await this._request("GET", `/bots/${id}/stats`);
    return {
      serverCount: result.server_count,
      shardCount: result.shard_count,
      shards: result.shards,
    };
  }

  /**
   * Get bot info
   *
   * @example
   * ```js
   * await api.getBot("461521980492087297"); // returns bot info
   * ```
   *
   * @param {Snowflake} id Bot ID
   * @returns {Promise<BotInfo>} Info for bot
   */
  public async getBot(id: Snowflake): Promise<BotInfo> {
    if (!id) throw new Error("Missing parameter bot ID");
    return this._request("GET", `/bots/${id}`);
  }

  /**
   * Retrieves information about a particular user by their Discord user id.
   *
   * @example
   * ```js
   * await api.getUser("205680187394752512");
   * // =>
   * user.username; // Xignotic
   * ```
   *
   * @param {Snowflake} id User ID
   * @returns {Promise<UserInfo>} Info for user
   */
  public async getUser(id: Snowflake): Promise<UserInfo> {
    if (!id) throw new Error("Missing parameter user ID");
    return this._request("GET", `/users/${id}`);
  }

  /**
   * Gets a list of bots that match a specific query.
   *
   * @example
   * ```js
   * // Finding by properties
   * await api.getBots({
   *   search: {
   *     username: "shiro",
   *     certifiedBot: true,
   *   },
   * });
   * // =>
   * {
   *   results: [
   *     {
   *       id: '461521980492087297',
   *       username: 'Shiro',
   *       discriminator: '8764',
   *       lib: 'discord.js',
   *       // ...rest of bot object
   *     }
   *     // ...other shiro knockoffs B)
   *   ],
   *   limit: 10,
   *   offset: 0,
   *   count: 1,
   *   total: 1
   * }
   * // Restricting fields
   * await api.getBots({
   *   fields: ["id", "username"],
   * });
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
   *     // ...
   *   ],
   *   // ...
   * }
   * ```
   *
   * @param {BotsQuery} query Bot Query
   * @returns {Promise<BotsResponse>} Return response
   */
  public async getBots(query?: BotsQuery): Promise<BotsResponse> {
    if (query) {
      if (Array.isArray(query.fields)) query.fields = query.fields.join(", ");
      if (query.search instanceof Object) {
        query.search = Object.entries(query.search)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" ");
      }
    }
    return this._request("GET", "/bots", query);
  }

  /**
   * Gets the last 1000 voters for your bot
   * 
   * If your bot receives more than 1000 votes monthly you cannot use this endpoints and must use webhooks and implement your own caching instead.
   * 
   * This endpoint only returns unique votes, it does not include double votes (weekend votes).
   *
   * @example
   * ```js
   * await api.getVotes();
   * // =>
   * [
   *   {
   *     username: 'Xignotic',
   *     id: '205680187394752512',
   *     avatar: '3b9335670c7213b3a2d4e990081900c7'
   *   },
   *   {
   *     username: 'iara',
   *     id: '395526710101278721',
   *     avatar: '3d1477390b8d7c3cec717ac5c778f5f4'
   *   }
   *   // ...more
   * ]
   * ```
   *
   * @returns {Promise<ShortUser[]>} Array of users who've voted
   */
  public async getVotes(): Promise<ShortUser[]> {
    if (!this.options.token) throw new Error("You must provide a token to the Top.gg API instance for this");
    return this._request("GET", "/bots/votes");
  }

  /**
   * Checking whether or not a user has voted for your bot in the last 12 hours. Safe to use even if you have over 1k monthly votes.
   *
   * @example
   * ```js
   * await api.hasVoted("205680187394752512");
   * // => true/false
   * ```
   *
   * @param {Snowflake} id User ID
   * @returns {Promise<boolean>} Whether the user has voted in the last 12 hours
   */
  public async hasVoted(id: Snowflake): Promise<boolean> {
    if (!id) throw new Error("Missing parameter user ID");
    return this._request("GET", "/bots/check", { userId: id }).then(
      (x) => !!x.voted
    );
  }

  /**
   * Whether or not the weekend multiplier is active
   *
   * @example
   * ```js
   * await api.isWeekend();
   * // => true/false
   * ```
   *
   * @returns {Promise<boolean>} Whether the multiplier is active
   */
  public async isWeekend(): Promise<boolean> {
    return this._request("GET", "/weekend").then((x) => x.is_weekend);
  }
}