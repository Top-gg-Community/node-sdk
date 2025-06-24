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
 * const client = new Topgg.Api(process.env.TOPGG_TOKEN);
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

    try {
      const tokenData = atob(tokenSegments[1]);
      const tokenId = JSON.parse(tokenData).id;

      options.id ??= tokenId;
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

    let url = `https://top.gg/api/v1${path}`;

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
   * Post your bot's server count to Top.gg
   *
   * @example
   * ```js
   * await client.postStats({
   *   serverCount: bot.getServerCount()
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
   * Get your bot's server count
   *
   * @example
   * ```js
   * const { serverCount } = await client.getStats();
   * ```
   *
   * @returns {BotStats} Your bot's stats
   */
  public async getStats(): Promise<BotStats> {
    const result = await this._request("GET", "/bots/stats");

    return {
      serverCount: result.server_count
    };
  }

  /**
   * Get bot info
   *
   * @example
   * ```js
   * const bot = await client.getBot("461521980492087297");
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
   * Get a list of bots
   *
   * @example
   * ```js
   * const bots = await client.getBots();
   * ```
   *
   * @param {BotsQuery} query Bot Query
   * @returns {BotsResponse} Return response
   */
  public async getBots(query?: BotsQuery): Promise<BotsResponse> {
    if (query) {
      if (Array.isArray(query.fields)) query.fields = query.fields.join(", ");
    }
    return this._request("GET", "/bots", query);
  }

  /**
   * Get recent unique users who've voted
   *
   * @example
   * ```js
   * // First page
   * const voters1 = await client.getVotes();
   * 
   * // Subsequent pages
   * const voters2 = await client.getVotes(2);
   * ```
   *
   * @param {number} [page] The page number. Each page can only have at most 100 voters.
   * @returns {ShortUser[]} Array of unique users who've voted
   */
  public async getVotes(page?: number): Promise<ShortUser[]> {
    return this._request("GET", `/bots/${this.options.id}/votes`, { page: page ?? 1 });
  }

  /**
   * Get whether or not a user has voted in the last 12 hours
   *
   * @example
   * ```js
   * const hasVoted = await client.hasVoted("205680187394752512");
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
   * const isWeekend = await client.isWeekend();
   * ```
   *
   * @returns {boolean} Whether the multiplier is active
   */
  public async isWeekend(): Promise<boolean> {
    return this._request("GET", "/weekend").then((x) => x.is_weekend);
  }
}
