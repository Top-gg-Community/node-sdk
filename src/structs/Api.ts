import type { APIApplicationCommand } from "discord-api-types/v10";
import type { IncomingHttpHeaders } from "undici/types/header";
import { request, type Dispatcher } from "undici";
import TopGGAPIError from "../utils/ApiError";
import { EventEmitter } from "events";
import { STATUS_CODES } from "http";

import {
  APIOptions,
  Snowflake,
  Vote,
  UserSource,
  Project,
} from "../typings";

/** The API version to use */
export const API_VERSION = "v1";

/** The API's base URL */
const BASE_URL = `https://top.gg/api/${API_VERSION}`;

/**
 * Top.gg API v1 client
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

  private async _request(
    method: Dispatcher.HttpMethod,
    path: string,
    body?: Record<string, any>
  ): Promise<any> {
    const headers: IncomingHttpHeaders = {};
    if (this.options.token) headers["authorization"] = `Bearer ${this.options.token}`;
    if (method !== "GET") headers["content-type"] = "application/json";

    let url = BASE_URL + path;

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
      throw new TopGGAPIError(
        response.statusCode,
        STATUS_CODES[response.statusCode] ?? "",
        response
      );
    }

    return responseBody;
  }

  /**
   * Gets your project's information.
   *
   * @example
   * ```js
   * const project = await client.getSelf();
   *
   * console.log(project);
   * // =>
   * // {
   * //   id: '218109768489992192',
   * //   name: 'Miki',
   * //   type: 'bot',
   * //   platform: 'discord',
   * //   headline: 'A great bot with tons of features! language | admin | cards | fun | levels | roles | marriage | currency | custom commands!',
   * //   tags: [
   * //     'anime',
   * //     'customizable-behavior',
   * //     'economy',
   * //     'fun',
   * //     'game',
   * //     'leveling',
   * //     'multifunctional',
   * //     'role-management',
   * //     'roleplay',
   * //     'social'
   * //   ],
   * //   votes: { current: 1120, total: 313389 },
   * //   review: { score: 4.38, count: 62245 }
   * // }
   * ```
   *
   * @returns {Promise<Project>} Your project's information.
   */
  public async getSelf(): Promise<Project> {
    const project = await this._request("GET", "/projects/@me");

    return {
      id: project.id,
      name: project.name,
      platform: project.platform,
      type: project.type,
      headline: project.headline,
      tags: project.tags,
      votes: {
        current: project.votes,
        total: project.votes_total
      },
      review: {
        score: project.review_score,
        count: project.review_count
      }
    };
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
   * @returns {Promise<void>}
   */
  public async postCommands(commands: APIApplicationCommand[]): Promise<void> {
    await this._request("POST", "/projects/@me/commands", commands);
  }

  /**
   * Gets the latest vote information of a Top.gg user on your project.
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
   * @returns {Promise<Vote | null>} The user's latest vote information on your project or null if the user has not voted for your project in the past 12 hours.
   */
  public async getVote(id: Snowflake, source: UserSource = "discord"): Promise<Vote | null> {
    if (!id) throw new Error("Missing ID");

    try {
      const response = await this._request("GET", `/projects/@me/votes/${id}?source=${source}`);

      return {
        votedAt: response.created_at,
        expiresAt: response.expires_at,
        weight: response.weight
      };
    } catch (err) {
      const topggError = err as TopGGAPIError;

      if (topggError.response?.statusCode === 404) {
        return null;
      }

      throw err;
    }
  }
}
