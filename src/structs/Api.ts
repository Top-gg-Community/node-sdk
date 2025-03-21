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
 * Top.gg API Client for Posting stats or Fetching data
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

    const tokenSegments = token.split(".");

    if (tokenSegments.length !== 3) {
      throw new Error("Got a malformed API token.");
    }

    const tokenData = atob(tokenSegments[1]);

    try {
      JSON.parse(tokenData).id;
    } catch {
      throw new Error(
        "Invalid API token state, this should not happen! Please report!"
      );
    }

    this.options = {
      token,
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
   * Post bot stats to Top.gg
   *
   * @example
   * ```js
   * await api.postStats({
   *   serverCount: 28199,
   * });
   * ```
   *
   * @param {object} stats Stats object
   * @param {number} stats.serverCount Server count
   * @returns {BotStats} Passed object
   */
  public async postStats(stats: BotStats): Promise<BotStats> {
    if ((stats?.serverCount ?? 0) <= 0) throw new Error("Missing server count");

    /* eslint-disable camelcase */
    await this._request("POST", "/bots/stats", {
      server_count: stats.serverCount,
    });
    /* eslint-enable camelcase */

    return stats;
  }

  /**
   * Get your bot's stats
   *
   * @example
   * ```js
   * await api.getStats();
   * // =>
   * {
   *   serverCount: 28199,
   *   shardCount: null,
   *   shards: []
   * }
   * ```
   *
   * @returns {BotStats} Your bot's stats
   */
  public async getStats(_id?: Snowflake): Promise<BotStats> {
    if (_id)
      console.warn(
        "[DeprecationWarning] getStats() no longer needs an ID argument"
      );
    const result = await this._request("GET", "/bots/stats");
    return {
      serverCount: result.server_count,
      shardCount: null,
      shards: [],
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
   * @returns {BotInfo} Info for bot
   */
  public async getBot(id: Snowflake): Promise<BotInfo> {
    if (!id) throw new Error("ID Missing");
    return this._request("GET", `/bots/${id}`);
  }

  /**
   * @deprecated No longer supported by Top.gg API v0.
   *
   * Get user info
   *
   * @example
   * ```js
   * await api.getUser("205680187394752512");
   * // =>
   * user.username; // Xignotic
   * ```
   *
   * @param {Snowflake} id User ID
   * @returns {UserInfo} Info for user
   */
  public async getUser(id: Snowflake): Promise<UserInfo> {
    console.warn(
      "[DeprecationWarning] getUser is no longer supported by Top.gg API v0."
    );

    return this._request("GET", `/users/${id}`);
  }

  /**
   * Get a list of bots
   *
   * @example
   * ```js
   * // Finding by properties
   * await api.getBots({
   *   search: {
   *     username: "shiro"
   *   },
   * });
   * // =>
   * {
   *   results: [
   *     {
   *       id: "461521980492087297",
   *       username: "Shiro",
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
   *     ...
   *   ],
   *   ...
   * }
   * ```
   *
   * @param {BotsQuery} query Bot Query
   * @returns {BotsResponse} Return response
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
   * Get recent unique users who've voted
   *
   * @example
   * ```js
   * await api.getVotes();
   * // =>
   * [
   *   {
   *     username: 'Xignotic',
   *     id: '205680187394752512',
   *     avatar: 'https://cdn.discordapp.com/avatars/1026525568344264724/cd70e62e41f691f1c05c8455d8c31e23.png'
   *   },
   *   {
   *     username: 'iara',
   *     id: '395526710101278721',
   *     avatar: 'https://cdn.discordapp.com/avatars/1026525568344264724/cd70e62e41f691f1c05c8455d8c31e23.png'
   *   }
   *   ...more
   * ]
   * ```
   *
   * @param {number} [page] The page number. Each page can only have at most 100 voters.
   * @returns {ShortUser[]} Array of unique users who've voted
   */
  public async getVotes(page?: number): Promise<ShortUser[]> {
    return this._request("GET", "/bots/votes", { page: page ?? 1 });
  }

  /**
   * Get whether or not a user has voted in the last 12 hours
   *
   * @example
   * ```js
   * await api.hasVoted("205680187394752512");
   * // => true/false
   * ```
   *
   * @param {Snowflake} id User ID
   * @returns {boolean} Whether the user has voted in the last 12 hours
   */
  public async hasVoted(id: Snowflake): Promise<boolean> {
    if (!id) throw new Error("Missing ID");
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
   * @returns {boolean} Whether the multiplier is active
   */
  public async isWeekend(): Promise<boolean> {
    return this._request("GET", "/weekend").then((x) => x.is_weekend);
  }
}
