/** Discord ID */
export type Snowflake = string;

export interface APIOptions {
  /** Top.gg API token */
  token?: string;

  /** Client ID to use */
  id?: Snowflake;
}

/** A user account from an external platform that is linked to a Top.gg user account. */
export type UserSource = "discord" | "topgg";

/** A project's source platform */
export type Platform = "discord";

/** A project's type */
export type Type = "bot" | "server";

/** A project listed on Top.gg */
export interface Project {
  /** The project's Top.gg ID */
  id: Snowflake;
  /** The project's name sourced from the external platform */
  name: string;
  /** The project's source platform */
  platform: Platform;
  /** The project's type */
  type: Type;
  /** The project's short description */
  headline: string;
  /** The project's tag IDs */
  tags: string[];
  /** The project's vote information */
  votes: {
    /** The project's current vote count that affects the project's ranking */
    current: number;
    /** The project's total vote count */
    total: number;
  };
  /** The project's review information */
  review: {
    /** The project's review score out of 5 */
    score: number;
    /** The project's total review count */
    count: number;
  };
}

/** A project's vote information */
export interface Vote {
  /** When the vote was cast */
  votedAt?: string;
  /** When the vote expires and the user is required to vote again */
  expiresAt?: string;
  /** This vote's weight. 1 during weekdays, 2 during weekends. */
  weight?: number;
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
