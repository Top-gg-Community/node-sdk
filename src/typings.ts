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
