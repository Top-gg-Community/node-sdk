export interface APIOptions {
  /** Top.gg token */
  token?: string;

  /** Discord bot ID */
  id?: string;
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

export interface BotStats {
  /** The amount of servers the bot is in */
  serverCount?: number;
}

export interface BotsQuery {
  /** The amount of bots to return. Max. 500 */
  limit?: number;
  /** Amount of bots to skip */
  offset?: number;
  /**
   * A search string in the format of "field: value field2: value2"
   * 
   * @deprecated No longer supported by Top.gg API v1.
   */
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
  /** User's avatar url */
  avatar: string;
}

export interface WebhookVotePayload {
  /** The ID of the Discord bot/server that received a vote. */
  receiverId: Snowflake;
  /** The ID of the Top.gg user who voted. */
  voterId: Snowflake;
  /**
   * Whether this vote is just a test done from the page settings.
   */
  isTest: boolean;
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
