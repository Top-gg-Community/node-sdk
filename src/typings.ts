export interface APIOptions {
  /** Top.gg token */
  token?: string;
}

/** Discord ID */
export type Snowflake = string;

export interface BotInfo {
  /** The Top.gg ID of the bot */
  id: Snowflake;
  /** The Discord ID of the bot */
  clientid: Snowflake;
  /** The username of the bot */
  username: string;
  /**
   * The discriminator of the bot
   *
   * @deprecated No longer supported by Top.gg API v0.
   */
  discriminator: string;
  /** The bot's avatar */
  avatar: string;
  /**
   * The cdn hash of the bot's avatar if the bot has none
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  defAvatar: string;
  /**
   * The URL for the banner image
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  bannerUrl?: string;
  /**
   * The library of the bot
   *
   * @deprecated No longer supported by Top.gg API v0.
   */
  lib: string;
  /** The prefix of the bot */
  prefix: string;
  /** The short description of the bot */
  shortdesc: string;
  /** The long description of the bot. Can contain HTML and/or Markdown */
  longdesc?: string;
  /** The tags of the bot */
  tags: string[];
  /** The website url of the bot */
  website?: string;
  /** The support url of the bot */
  support?: string;
  /** The link to the github repo of the bot */
  github?: string;
  /** The owners of the bot. First one in the array is the main owner */
  owners: Snowflake[];
  /**
   * The guilds featured on the bot page
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  guilds: Snowflake[];
  /** The custom bot invite url of the bot */
  invite?: string;
  /** The date when the bot was submitted (in ISO 8601) */
  date: string;
  /**
   * The certified status of the bot
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  certifiedBot: boolean;
  /** The vanity url of the bot */
  vanity?: string;
  /** The amount of votes the bot has */
  points: number;
  /** The amount of votes the bot has this month */
  monthlyPoints: number;
  /**
   * The guild id for the donatebot setup
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  donatebotguildid: Snowflake;
  /** The amount of servers the bot is in based on posted stats */
  server_count?: number;
  /** The bot's reviews on Top.gg */
  reviews: {
    /** This bot's average review score out of 5 */
    averageScore: number;
    /** This bot's review count */
    count: number;
  }
}

export interface BotStats {
  /** The amount of servers the bot is in */
  serverCount?: number;
  /**
   * The amount of servers the bot is in per shard. Always present but can be
   * empty. (Only when receiving stats)
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  shards?: number[];
  /**
   * The shard ID to post as (only when posting)
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  shardId?: number;
  /**
   * The amount of shards a bot has
   * 
   * @deprecated No longer supported by Top.gg API v0.
   */
  shardCount?: number | null;
}

/**
 * @deprecated No longer supported by Top.gg API v0.
 */
export interface UserInfo {
  /** The id of the user */
  id: Snowflake;
  /** The username of the user */
  username: string;
  /** The discriminator of the user */
  discriminator: string;
  /** The user's avatar url */
  avatar: string;
  /** The cdn hash of the user's avatar if the user has none */
  defAvatar: string;
  /** The bio of the user */
  bio?: string;
  /** The banner image url of the user */
  banner?: string;
  /** The social usernames of the user */
  social: {
    /** The youtube channel id of the user */
    youtube?: string;
    /** The reddit username of the user */
    reddit?: string;
    /** The twitter username of the user */
    twitter?: string;
    /** The instagram username of the user */
    instagram?: string;
    /** The github username of the user */
    github?: string;
  };
  /** The custom hex color of the user */
  color: string;
  /** The supporter status of the user */
  supporter: boolean;
  /** The certified status of the user */
  certifiedDev: boolean;
  /** The mod status of the user */
  mod: boolean;
  /** The website moderator status of the user */
  webMod: boolean;
  /** The admin status of the user */
  admin: boolean;
}

export interface BotsQuery {
  /** The amount of bots to return. Max. 500 */
  limit?: number;
  /** Amount of bots to skip */
  offset?: number;
  /** A search string in the format of "field: value field2: value2" */
  search?:
    | {
        [key in keyof BotInfo]: string;
      }
    | string;
  /** Sorts results from a specific criteria. Results will always be descending. */
  sort?: "monthlyPoints" | "id" | "date";
  /** A list of fields to show. */
  fields?: string[] | string;
}

export interface BotsResponse {
  /** The matching bots */
  results: BotInfo[];
  /** The limit used */
  limit: number;
  /** The offset used */
  offset: number;
  /** The length of the results array */
  count: number;
  /** The total number of bots matching your search */
  total: number;
}

export interface ShortUser {
  /** User's ID */
  id: Snowflake;
  /** User's username */
  username: string;
  /**
   * User's discriminator
   *
   * @deprecated No longer supported by Top.gg API v0.
   */
  discriminator: string;
  /** User's avatar url */
  avatar: string;
}

export interface WebhookPayload {
  /** If webhook is a bot: ID of the bot that received a vote */
  bot?: Snowflake;
  /** If webhook is a server: ID of the server that received a vote */
  guild?: Snowflake;
  /** ID of the user who voted */
  user: Snowflake;
  /**
   * The type of the vote (should always be "upvote" except when using the test
   * button it's "test")
   */
  type: string;
  /**
   * Whether the weekend multiplier is in effect, meaning users votes count as
   * two
   */
  isWeekend?: boolean;
  /** Query parameters in vote page in a key to value object */
  query:
    | {
        [key: string]: string;
      }
    | string;
}

declare module "express" {
  export interface Request {
    vote?: WebhookPayload;
  }
}
