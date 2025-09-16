export interface APIOptions {
  /** Top.gg API token */
  token?: string;

  /** Client ID to use */
  id?: string;
}

/** Discord ID */
export type Snowflake = string;

/** A user account from an external platform that is linked to a Top.gg user account. */
export type UserSource = "discord" | "topgg";

export interface BotInfo {
  /** The Top.gg ID of the bot */
  id: Snowflake;
  /** The Discord ID of the bot */
  clientid: Snowflake;
  /** The username of the bot */
  username: string;
  /** The bot's avatar */
  avatar: string;
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
  /** The custom bot invite url of the bot */
  invite?: string;
  /** The date when the bot was submitted (in ISO 8601) */
  date: string;
  /** The vanity url of the bot */
  vanity?: string;
  /** The amount of votes the bot has */
  points: number;
  /** The amount of votes the bot has this month */
  monthlyPoints: number;
  /** The amount of servers the bot is in based on posted stats */
  server_count?: number;
  /** The bot's reviews on Top.gg */
  reviews: {
    /** This bot's average review score out of 5 */
    averageScore: number;
    /** This bot's review count */
    count: number;
  };
}

export interface BotsQuery {
  /** The amount of bots to return. Max. 500 */
  limit?: number;
  /** Amount of bots to skip */
  offset?: number;
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

export interface Vote {
  /** When the vote was cast */
  votedAt?: string;
  /** When the vote expires and the user is required to vote again */
  expiresAt?: string;
  /** This vote's weight. 1 during weekdays, 2 during weekends. */
  weight?: number;
}

export interface ShortUser {
  /** User's ID */
  id: Snowflake;
  /** User's username */
  username: string;
  /** User's avatar url */
  avatar: string;
}

export interface WebhookPayload {
  /** If webhook is a Discord bot: ID of the bot that received a vote */
  bot?: Snowflake;
  /** If webhook is a server: ID of the server that received a vote */
  guild?: Snowflake;
  /** ID of the user who voted */
  user: Snowflake;
  /** The type of the vote (should always be "upvote" except when using the test button it's "test") */
  type: string;
  /** Whether the weekend multiplier is in effect, meaning users votes count as two */
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
