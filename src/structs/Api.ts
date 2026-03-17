import type { APIApplicationCommand } from "discord-api-types/v10";
import TopGGAPIError from "../utils/ApiError";
import { EventEmitter } from "events";
import { STATUS_CODES } from "http";

import {
  APIOptions,
  Snowflake,
  UserSource,
  Project,
  PartialVote,
  PaginatedVotes
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
 * import Topgg from "@top-gg/sdk";
 *
 * const client = new Topgg.Api(process.env.TOPGG_TOKEN);
 * ```
 *
 * @link {@link https://topgg.js.org | SDK docs}
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
      token,
      ...options
    };
  }

  private async _request(
    method: string,
    path: string,
    body?: Record<string, any>
  ): Promise<any> {
    const headers = new Headers();

    if (this.options.token)
      headers.set("authorization", `Bearer ${this.options.token}`);
    if (method !== "GET") headers.set("content-type", "application/json");

    let url = BASE_URL + path;

    if (body && method === "GET") url += `?${new URLSearchParams(body)}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined
    });

    let responseBody: string | object | undefined;

    if (response.headers.get("content-type")?.includes("json")) {
      responseBody = (await response.json()) as object;
    } else {
      responseBody = await response.text();
    }

    if (response.status < 200 || response.status > 299) {
      throw new TopGGAPIError(STATUS_CODES[response.status] ?? "", response);
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
   * const commands = (await bot.application.commands.fetch()).map(command => command.toJSON());
   *
   * // Raw:
   * //   Array of application commands that
   * //   can be serialized to Discord API's raw JSON format.
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
   * @returns {Promise<PartialVote | null>} The user's latest vote information on your project or null if the user has not voted for your project in the past 12 hours.
   */
  public async getVote(
    id: Snowflake,
    source: UserSource = "discord"
  ): Promise<PartialVote | null> {
    if (!id) throw new Error("Missing ID");

    try {
      const response = await this._request(
        "GET",
        `/projects/@me/votes/${id}?source=${source}`
      );

      return {
        votedAt: new Date(response.created_at),
        expiresAt: new Date(response.expires_at),
        weight: response.weight
      };
    } catch (err) {
      const topggError = err as TopGGAPIError;

      if (topggError.response.status === 404) {
        return null;
      }

      throw err;
    }
  }

  private async _getVotesInner(options: {
    since?: Date;
    cursor?: string;
  }): Promise<PaginatedVotes> {
    const response = await this._request(
      "GET",
      `/projects/@me/votes?${options.since ? `startDate=${encodeURIComponent(options.since.toISOString())}` : `cursor=${options.cursor}`}`
    );
    /* eslint-disable-next-line @typescript-eslint/no-this-alias */
    const self = this;

    return {
      votes: response.data.map((vote: any) => ({
        voterId: vote.user_id,
        platformId: vote.platform_id,
        votedAt: new Date(vote.created_at),
        expiresAt: new Date(vote.expires_at),
        weight: vote.weight
      })),
      next: () =>
        self._getVotesInner({
          cursor: response.cursor
        })
    };
  }

  /**
   * Gets a cursor-based paginated list of votes for your project, ordered by creation date.
   *
   * @example
   * ```js
   * const since = new Date("2026-01-01");
   *
   * const firstPage = await client.getVotes(since);
   * console.log(firstPage.votes);
   *
   * const secondPage = await firstPage.next();
   * console.log(secondPage.votes);
   * ```
   *
   * @param {Date} since Timestamp to start fetching votes from.
   * @returns {Promise<PaginatedVotes>} A cursor-based paginated list of votes for your project.
   */
  public async getVotes(since: Date): Promise<PaginatedVotes> {
    return await this._getVotesInner({ since });
  }
}
