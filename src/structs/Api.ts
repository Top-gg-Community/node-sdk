import type { APIApplicationCommand } from "discord-api-types/v10";
import type { IncomingHttpHeaders } from "undici/types/header";
import { request, type Dispatcher } from "undici";
import APIError from "../utils/ApiError";
import { EventEmitter } from "events";
import { STATUS_CODES } from "http";

import {
  APIOptions,
  Snowflake,
  BotInfo,
  BotsResponse,
  BotStats,
  ShortUser,
  BotsQuery,
  Vote,
  UserInfo,
  UserSource,
} from "../typings";

/**
 * Top.gg API v0 client
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
  protected options: APIOptions;

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
      const tokenData = JSON.parse(atob(tokenSegments[1]));
      const tokenId = tokenData.id;

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

  protected async _request(
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

    let responseBody: string | object | undefined;

    if (
      (response.headers["content-type"] as string)?.includes(
        "json"
      )
    ) {
      responseBody = await response.body.json() as object;
    } else {
      responseBody = await response.body.text();
    }

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new APIError(
        response.statusCode,
        STATUS_CODES[response.statusCode] ?? "",
        responseBody
      );
    }

    return responseBody;
  }

  /**
   * Post your bot's stats to Top.gg
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
   * @param {Snowflake} _id User ID
   * @returns {UserInfo} Info for user
   */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getUser(_id: Snowflake): Promise<UserInfo> {
    throw new APIError(
      404,
      STATUS_CODES[404]!,
      "getUser is no longer supported by Top.gg API v0."
    );
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
   * Get recent 100 unique voters
   *
   * @example
   * ```js
   * // First page
   * const voters1 = await client.getVoters();
   * 
   * // Subsequent pages
   * const voters2 = await client.getVoters(2);
   * ```
   *
   * @param {number} [page] The page number. Page numbers start at 1. Each page can only have at most 100 voters.
   * @returns {ShortUser[]} Array of 100 unique voters
   */
  public async getVotes(page?: number): Promise<ShortUser[]> {
    return this._request("GET", `/bots/${this.options.id}/votes`, { page: page ?? 1 });
  }

  /**
   * Get whether or not a user has voted in the last 12 hours
   *
   * @example
   * ```js
   * const hasVoted = await client.hasVoted("661200758510977084");
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

/**
 * Top.gg API v1 client
 *
 * @example
 * ```js
 * const Topgg = require("@top-gg/sdk");
 * 
 * const client = new Topgg.V1Api(process.env.TOPGG_TOKEN);
 * ```
 *
 * @link {@link https://topgg.js.org | Library docs}
 * @link {@link https://docs.top.gg | API Reference}
 */
export class V1Api extends Api {
    /**
   * Create Top.gg API instance
   *
   * @param {string} token Token or options
   * @param {APIOptions} [options] API Options
   */
  constructor(token: string, options: APIOptions = {}) {
    super(token, options);
  }

  /**
   * Updates the application commands list in your Discord bot's Top.gg page.
   *
   * @example
   * ```js
   * // Discord.js:
   * const commands = (await bot.application.commands.fetch()).map(cmd => cmd.toJSON());
   * 
   * // Eris:
   * const commands = await bot.getCommands();
   * 
   * // Discordeno:
   * import { getApplicationCommands } from "discordeno";
   * 
   * const commands = await getApplicationCommands(bot);
   * 
   * // Harmony:
   * const commands = await bot.interactions.commands.all();
   * 
   * // Oceanic:
   * const commands = await bot.application.getGlobalCommands();
   * 
   * await client.postCommands(commands);
   * 
   * // Raw:
   * await client.postCommands([
   *   {
   *     options: [],
   *     name: 'test',
   *     name_localizations: null,
   *     description: 'command description',
   *     description_localizations: null,
   *     contexts: [],
   *     default_permission: null,
   *     default_member_permissions: null,
   *     dm_permission: false,
   *     integration_types: [],
   *     nsfw: false
   *   }
   * ]);
   * ```
   *
   * @param {APIApplicationCommand[]} commands A list of application commands in raw Discord API JSON objects. This cannot be empty.
   */
  public async postCommands(commands: APIApplicationCommand[]): Promise<void> {
    await this._request("POST", "/v1/projects/@me/commands", commands);
  }

  /**
   * Get the latest vote information of a Top.gg user on your project.
   *
   * @example
   * ```js
   * // Discord ID
   * const vote = await client.getVote("661200758510977084");
   * 
   * // Top.gg ID
   * const vote = await client.getVote("8226924471638491136", "topgg");
   * ```
   *
   * @param {Snowflake} id The user's ID.
   * @param {UserSource} source The ID type to use. Defaults to "discord".
   * 
   * @returns {Vote | null} The user's latest vote information on your project or null if the user has not voted for your project in the past 12 hours.
   */
  public async getVote(id: Snowflake, source: UserSource = "discord"): Promise<Vote | null> {
    if (!id) throw new Error("Missing ID");

    try {
      const response = await this._request("GET", `/v1/projects/@me/votes/${id}?source=${source}`);

      return {
        votedAt: response.created_at,
        expiresAt: response.expires_at,
        weight: response.weight
      };
    } catch (err) {
      const topggError = err as APIError;

      if (topggError.statusCode === 404) {
        return null;
      }

      throw err;
    }
  }
}
