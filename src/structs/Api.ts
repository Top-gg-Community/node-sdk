import type { APIApplicationCommand } from "discord-api-types/v10";
import TopGGAPIError from "../utils/ApiError.js";
import { EventEmitter } from "events";
import { STATUS_CODES } from "http";

import type {
  Announcement,
  AnnouncementType,
  APIOptions,
  Method,
  MetricsPayload,
  PaginatedVotes,
  PartialVote,
  Project,
  ProjectPayload,
  Snowflake,
  UserSource,
} from "../typings.js";

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
      ...options,
    };
  }

  private async _request(
    method: Method,
    path: string,
    body?: Record<string, any>,
  ): Promise<any> {
    const headers = new Headers();

    if (this.options.token)
      headers.set("authorization", `Bearer ${this.options.token}`);
    if (method !== "GET") headers.set("content-type", "application/json");

    const response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });

    let responseBody: string | object | undefined;

    if (response.headers.get("content-type")?.includes("json")) {
      responseBody = (await response.json()) as object;
    } else {
      responseBody = await response.text();
    }

    if (response.status < 200 || response.status > 299) {
      /* node:coverage ignore next 1 */
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
        total: project.votes_total,
      },
      review: {
        score: project.review_score,
        count: project.review_count,
      },
    };
  }

  /**
   * Updates the headline and/or page content for your project. Both fields are locale-keyed, so you can set content for multiple languages in a single request.
   *
   * @example
   * ```js
   * await client.editSelf({
   *  headline: {
   *    "en": "A great bot with tons of features!"
   *  },
   *  content: {
   *    "en": "# Welcome\nThis is the full page description for your project..."
   *  }
   * });
   * ```
   *
   * @param {ProjectPayload} options The project payload options.
   * @returns {Promise<void>}
   */
  public async editSelf(options: ProjectPayload): Promise<void> {
    await this._request("PATCH", "/projects/@me", {
      headline: options.headline,
      page_content: options.content,
    });
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
   * Creates a new announcement for your project. Announcements appear on your project's page and can be used to notify users about updates, new features, or other news.
   *
   * @example
   * ```js
   * const announcement = await client.postAnnouncement(
   *    "Version 2.0 Released!",
   *    "We just released version 2.0 with a bunch of new features and improvements."
   * );
   *
   * console.log(announcement)
   * // =>
   * // {
   * //   title: "Version 2.0 Released!",
   * //   content: "We just released version 2.0 with a bunch of new features and improvements.",
   * //   createdAt: "2026-03-14T15:09:26Z"
   * // }
   * ```
   *
   * @param {string} title The announcement title. Must be between 3 and 100 characters.
   * @param {string} content The announcement body text. Must be between 10 and 2,000 characters.
   * @param {AnnouncementType} category The category to publish the announcement under. Defaults to `announcement` when omitted.
   * @returns {Promise<Announcement>} The created announcement.
   */
  public async postAnnouncement(
    title: string,
    content: string,
    category?: AnnouncementType,
  ): Promise<Announcement> {
    const announcement = await this._request(
      "POST",
      "/projects/@me/announcements",
      { title, content, category },
    );

    return {
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.created_at,
    };
  }

  private _parseMetrics(payload: MetricsPayload) {
    if ("serverCount" in payload || "shardCount" in payload) {
      return {
        server_count: payload.serverCount,
        shard_count: payload.shardCount,
      };
    }

    if ("memberCount" in payload || "onlineCount" in payload) {
      return {
        member_count: payload.memberCount,
        online_count: payload.onlineCount,
      };
    }

    if ("playerCount" in payload) {
      return {
        player_count: payload.playerCount,
      };
    }
  }

  /**
   * Submits a single or batch of metrics payloads for your project. Use this to push fresh numbers after an event such as joining or leaving a guild or a player connecting.
   *
   * @example
   * ```js
   * // Single
   * await client.postMetrics({ serverCount: 420, shardCount: 53 });
   *
   * // Batch
   * await client.postMetrics([
   *  {
   *    timestamp: "2026-04-17T10:00:00Z",
   *    serverCount: 420,
   *    shardCount: 53
   *  },
   *  {
   *    serverCount: 435
   *  }
   * ]);
   * ```
   *
   * @param payload The metrics payload. Can be a single object or an array of objects with up to 100 entries.
   * @returns {Promise<void>}
   */
  public async postMetrics(
    payload: MetricsPayload | (MetricsPayload & { timestamp?: string })[],
  ): Promise<void> {
    if (!Array.isArray(payload)) {
      await this._request(
        "PATCH",
        "/projects/@me/metrics",
        this._parseMetrics(payload),
      );
      return;
    }

    await this._request("POST", "/projects/@me/metrics/batch", {
      data: payload.map(({ timestamp, ...metrics }) => ({
        timestamp,
        metrics: this._parseMetrics(metrics),
      })),
    });
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
   * @returns {Promise<PartialVote | null>} The user's latest vote information on your project or null if the user does not exist or has not voted for your project in the past 12 hours.
   */
  public async getVote(
    id: Snowflake,
    source: UserSource = "discord",
  ): Promise<PartialVote | null> {
    if (!id) throw new Error("Missing ID");

    try {
      const response = await this._request(
        "GET",
        `/projects/@me/votes/${id}?source=${source}`,
      );

      return {
        votedAt: new Date(response.created_at),
        expiresAt: new Date(response.expires_at),
        weight: response.weight,
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
      `/projects/@me/votes?${options.since ? `startDate=${encodeURIComponent(options.since.toISOString())}` : `cursor=${options.cursor}`}`,
    );
    /* eslint-disable-next-line @typescript-eslint/no-this-alias */
    const self = this;

    return {
      votes: response.data.map((vote: any) => ({
        voterId: vote.user_id,
        platformId: vote.platform_id,
        votedAt: new Date(vote.created_at),
        expiresAt: new Date(vote.expires_at),
        weight: vote.weight,
      })),
      next: () =>
        self._getVotesInner({
          cursor: response.cursor,
        }),
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
