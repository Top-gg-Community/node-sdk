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

/** A project's platform */
export type Platform = "discord";

/** A project's type */
export type Type = "bot" | "server";

/** A webhook payload's type */
export type WebhookPayloadType = "webhook.test" | "vote.create";

/** A project listed on Top.gg */
export interface Project {
  /** The project's ID */
  id: Snowflake;
  /** The project's name sourced from the external platform */
  name: string;
  /** The project's platform */
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

/** A brief information on project listed on Top.gg */
export interface PartialProject {
  /** The project's ID */
  id: Snowflake;
  /** The project's type */
  type: Type;
  /** The project's platform */
  platform: Platform;
  /** The project's platform ID */
  platformID: Snowflake;
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

/** A Top.gg user */
export interface User {
  /** The user's ID */
  id: Snowflake;
  /** The user's name */
  name: string;
  /** The user's avatar URL */
  avatarURL: string;
  /** The user's platform ID */
  platformID: Snowflake;
}

/** A `vote.create` webhook payload */
export interface VoteCreatePayload {
  /** The vote's ID */
  id: Snowflake;
  /** The number of votes this vote counted for. This is a rounded integer value which determines how many points this individual vote was worth */
  weight: number;
  /** When the vote was cast */
  createdAt: Date;
  /** When the vote expires (the user can vote again) */
  expiresAt: Date;
  /** The project that received this vote */
  project: PartialProject;
  /** The user who voted for this project */
  user: User;
}

/** A `webhook.test` webhook payload */
export interface WebhookTestPayload {
  /** The project that the test refers to */
  project: PartialProject;
  /** The user who triggered this test */
  user: User;
}

export interface WebhookPayload {
  /** The payload's type */
  type: WebhookPayloadType;
  /** The payload's data */
  data: VoteCreatePayload | WebhookTestPayload;
  /** The payload's x-topgg-trace header for debugging and correlating requests with Top.gg support */
  trace: string | string[] | undefined;
}

declare module "express" {
  export interface Request {
    topggPayload?: WebhookPayload;
  }
}
