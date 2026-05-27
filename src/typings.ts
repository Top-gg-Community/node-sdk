/** Discord ID */
export type Snowflake = string;

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface APIOptions {
  /** Top.gg API token */
  token?: string;
  /** Client ID to use */
  id?: Snowflake;
}

/** A user account from an external platform that is linked to a Top.gg user account. */
export type UserSource = "discord" | "topgg";

/** A project's platform */
export type Platform = "discord" | "roblox";

/** A project's type */
export type ProjectType = "bot" | "server" | "game";

/** An announcement's type */
export type AnnouncementType = "announcement" | "event" | "new_feature";

/** A locale for a project's payload */
export type Locale =
  | "en"
  | "de"
  | "fr"
  | "pt"
  | "tr"
  | "hi"
  | "ja"
  | "ar"
  | "nl"
  | "ko"
  | "it"
  | "es"
  | "ru"
  | "uk"
  | "vi"
  | "zh";

/** A webhook payload's type */
export type WebhookPayloadType =
  | "integration.create"
  | "integration.delete"
  | "webhook.test"
  | "vote.create";

/** A project listed on Top.gg */
export interface Project {
  /** The project's ID */
  id: Snowflake;
  /** The project's name sourced from the external platform */
  name: string;
  /** The project's platform */
  platform: Platform;
  /** The project's type */
  type: ProjectType;
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

/** A project payload */
export interface ProjectPayload {
  /** The project's short description */
  headline?: Partial<Record<Locale, string>>;
  /** The project's page content */
  content?: Partial<Record<Locale, string>>;
}

/** A brief information on a project listed on Top.gg */
export interface PartialProject {
  /** The project's ID */
  id: Snowflake;
  /** The project's type */
  type: ProjectType;
  /** The project's platform */
  platform: Platform;
  /** The project's platform ID */
  platformId: Snowflake;
}

/** A brief information of a project's vote */
export interface PartialVote {
  /** When the vote was cast */
  votedAt: Date;
  /** When the vote expires and the user is required to vote again */
  expiresAt: Date;
  /** The vote's weight. 1 during weekdays, 2 during weekends. */
  weight: number;
}

/** A project's vote information */
export interface Vote extends PartialVote {
  /** The voter's ID */
  voterId: Snowflake;
  /** The voter's ID on the project's platform */
  platformId: Snowflake;
}

/** A paginated list of a project's vote information. */
export interface PaginatedVotes {
  /** The votes in this page */
  votes: Vote[];
  /** Tries to advance to the next page */
  next(): Promise<PaginatedVotes>;
}

/** An announcement of a project */
export interface Announcement {
  /** The announcement's title */
  title: string;
  /** The announcement's content */
  content: string;
  /** The announcement's creation timestamp */
  createdAt: string;
}

/** A Top.gg user */
export interface User {
  /** The user's ID */
  id: Snowflake;
  /** The user's name */
  name: string;
  /** The user's avatar URL */
  avatar: string;
  /** The user's platform ID */
  platformId: Snowflake;
}

/** A `vote.create` webhook payload */
export interface VoteCreatePayload {
  /** The vote's ID */
  id: Snowflake;
  /** The number of votes this vote counted for. This is a rounded integer value which determines how many points this individual vote was worth */
  weight: number;
  /** When the vote was cast */
  votedAt: Date;
  /** When the vote expires (the user can vote again) */
  expiresAt: Date;
  /** The project that received this vote */
  project: PartialProject;
  /** The user who voted for this project */
  user: User;
}

/** An `integration.create` webhook payload */
export interface IntegrationCreatePayload {
  /** The unique identifier for this connection */
  connectionId: Snowflake;
  /** The secret used to verify future webhook deliveries */
  secret: string;
  /** The project that the integration refers to */
  project: PartialProject;
  /** The user who triggered this event */
  user: User;
}

/** An `integration.delete` webhook payload */
export interface IntegrationDeletePayload {
  /** The unique identifier for this connection */
  connectionId: Snowflake;
}

/** A `webhook.test` webhook payload */
export interface WebhookTestPayload {
  /** The project that the test refers to */
  project: PartialProject;
  /** The user who triggered this test */
  user: User;
}

/** A webhook payload */
export interface WebhookPayload {
  /** The payload's type */
  type: WebhookPayloadType;
  /** The payload's data */
  data:
    | IntegrationCreatePayload
    | IntegrationDeletePayload
    | VoteCreatePayload
    | WebhookTestPayload;
  /** The payload's x-topgg-trace header for debugging and correlating requests with Top.gg support */
  trace: string | string[] | undefined;
}

/** A Discord bot payload */
export interface DiscordBotPayload {
  /** The total number of servers the bot is currently in */
  serverCount?: number;
  /** The number of shards the bot is currently running */
  shardCount?: number;
}

/** A Discord server payload */
export interface DiscordServerPayload {
  /** The total number of members in the server */
  memberCount?: number;
  /** The number of members currently online */
  onlineCount?: number;
}

/** A Roblox game payload */
export interface RobloxGamePayload {
  /** The current number of players in the game */
  playerCount: number;
}

/** A metrics payload */
export type MetricsPayload =
  | DiscordBotPayload
  | DiscordServerPayload
  | RobloxGamePayload;

declare module "express" {
  export interface Request {
    topggPayload?: WebhookPayload;
  }
}
