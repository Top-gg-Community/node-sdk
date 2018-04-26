export = DBLAPI;

declare class DBLAPI {
  constructor(token: string, options: DBLAPI.DBLOptions, client?: object);
  constructor(token: string, client?: object);

  public postStats(serverCount: number, shardId?: number, shardCount?: number): Promise<Buffer>
  public getStats(id: string): Promise<DBLAPI.BotStats>
  public getBot(id: string): Promise<DBLAPI.Bot>
  public getUser(id: string): Promise<DBLAPI.User>
  public getBots(query: DBLAPI.BotsQuery): Promise<DBLAPI.BotSearchResult>
  public getVotes(): Promise<DBLAPI.Vote[]>
  public hasVoted(id: string): Promise<boolean>

  public token?: string;

  private _request(method: string, endpoint: string, data?: object, auth?: boolean): Promise<object>
}

import { EventEmitter } from 'events';
import { Server, ServerResponse, IncomingMessage } from 'http';
declare class DBLWebhook extends EventEmitter {
  constructor(port: number, path?: string, auth?: string)

  public port: number;
  public path: string;
  public auth?: string;
  private _server: Server;
  private _startWebhook(): void;
  private _handleRequest(req: IncomingMessage, res: ServerResponse): void;
  private _returnResponse(res: ServerResponse, statusCode: number, data?: string): void;

  public on(event: 'ready', listener: (hostname: string, port: number, path: string) => void): this;
  public on(event: 'vote', listener: (bot: string, user: string, type: string, query?: object) => void): this;
}

declare namespace DBLAPI {
  export type DBLOptions = {
    statsInterval?: number;
    webhookPort?: number;
    webhookAuth?: string;
    webhookPath?: string;
  }

  export type BotStats = {
    server_count: number;
    shards: number[];
    shard_count: number;
  }

  export type Bot = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    lib: string;
    prefix: string;
    shortdesc: string;
    longdesc?: string;
    tags: string[];
    website?: string;
    support?: string;
    github?: string;
    owners: number[];
    invite?: string;
    date: Date;
    certifiedBot: boolean;
    vanity?: string;
    points: number;
  }

  export type User = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    bio?: string;
    banner?: string;
    social: UserSocial;
    color?: string;
    supporter: boolean;
    certifiedDev: boolean;
    mod: boolean;
    webMod: boolean;
    admin: boolean;
  }

  export type UserSocial = {
    youtube?: string;
    reddit?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  }

  export type BotsQuery = {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
  }

  export type BotSearchResult = {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
  }

  export type Vote = {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
  }
}
