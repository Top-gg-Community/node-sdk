export = DBLAPI;
import { EventEmitter } from 'events';
/**
 * ## Example of posting server count with supported libraries (Discord.js and Eris)
 *
 * ```
 * const Discord = require("discord.js");
 * const client = new Discord.Client();
 * const DBL = require("dblapi.js");
 * const dbl = new DBL('Your top.gg token', client);
 *
 * // Optional events
 * dbl.on('posted', () => {
 *   console.log('Server count posted!');
 * })
 *
 * dbl.on('error', e => {
 *  console.log(`Oops! ${e}`);
 * })
 * ```
 *
 * ## Example of using webhooks to receive vote updates
 *
 * ```
 * const DBL = require('dblapi.js');
 * const dbl = new DBL(yourDBLTokenHere, { webhookPort: 5000, webhookAuth: 'password' });
 * dbl.webhook.on('ready', hook => {
 *   console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
 * });
 * dbl.webhook.on('vote', vote => {
 *   console.log(`User with ID ${vote.user} just voted!`);
 * });
 * ```
 *
 * ## For Typescript Users
 *
 * ```
 * import DBL, { VoteEventArgs, ReadyEventArgs } from 'dblapi.js';
 * const dbl = new DBL('yourDBLTokenHere', {
 *   webhookPort: 5000,
 *   webhookAuth: 'password',
 * });
 * dbl.webhook?.on('ready', (hook: ReadyEventArgs) => {
 *   console.log(`Webhook listening on port ${hook.port}`);
 * });
 * dbl.webhook?.on('vote', (vote: VoteEventArgs) => {
 *   console.log(`User ${vote.user} voted for bot ${vote.bot}`);
 * });
 * ```
 *
 *
 */
declare class DBLAPI extends EventEmitter {
  /**
   * ## Constructor
   * ```
   * new DBL(token, [options], [client])
   * ```
   * Or
   * ```
   * new DBL(token, [client])
   * ```
   */
  constructor(token: string, options: DBLAPI.DBLOptions, client?: object);
  constructor(token: string, client?: object);

  public webhook?: DBLWebhook;
  /**
   * ## Post stats to the DBL API ``.postStats()``
   *
   * ## Example
   * ```
   * client.on('ready', () => {
   *    setInterval(() => {
   *        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
   *    }, 1800000);
   *});
   * ```
   * | Parameter | Type | Description |
   * | --- | --- | --- |
   * | ``serverCount`` | Number | How often the autoposter should post stats in ms. May not be smaller than 900000 (15 minutes). Default: ``1800000`` (30 minutes)
   * | ``shardId`` | Number | The port to run the webhook on. Will activate webhook when set. |
   * | ``shardCount`` | String | The string for Authorization you set on the site for verification. |
   * | ``webhookPath`` | String | The path for the webhook request. Default: ``'/dblwebhook'`` |
   * | ``webhookServer`` | http.Server | An existing server to run the webhook on. Will activate webhook when set.  |
   *
   */
  public postStats(
    serverCount: number,
    shardId?: number,
    shardCount?: number
  ): Promise<object>;
  /**
   * ## Post stats to the DBL API ``.getStats()``
   *
   * ## Example
   * ```
   *dbl.getStats("264811613708746752").then(stats => {
   *  console.log(stats) // {"server_count":2,"shards":[]}
   *});
   * ```
   * ## Returns Object
   * | Property | Type | Always Present | Description |
   * | --- | --- | --- | --- |
   * | ``server_count`` | Number | No | The server count of the bot. |
   * | ``shards`` | Array<Number> | Yes | The shards of this bot OR empty array. |
   * | ``shard_count`` | Number | Yes | The count of all shards of the bot. |
   */
  public getStats(id: string): Promise<DBLAPI.BotStats>;
  /**
   * ## Fetches a bot by ID ``.getBot()``
   *
   * ## Example
   * ```
   *dbl.getBot("264811613708746752").then(bot => {
   *    console.log(bot.username) // "Luca"
   *});
   * ```
   * ## Returns Object
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``id``| Number | Yes | The id of the bot |
   * |``username``| String | Yes | Username of the bot |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the bot |
   * |``avatar``| String | No | Avatar hash |
   * |``defAvatar``| String | Yes | Default avatar hash |
   * |``lib``| String | Yes | The library the bot is using |
   * |``prefix``| String | Yes | The bot prefix |
   * |``shortdesc``| String | Yes | The short description of the bot |
   * |``longdesc``| String | Yes | The long description of the bot |
   * |``tags``| Array<String> | Yes | The array of tag(s) of the bot |
   * |``website``| String | No | The website linked at the bots DBL page |
   * |``support``| String | No | The discord support ending. Ex: 'KYZsaFb'. Add this to discord.gg/'ending' |
   * |``github``| String | No | The repository of the bot |
   * |``owners``| Array<String> | Yes | The array of owners of the bot |
   * |``invite``| String | Yes | The invite url for the bot |
   * |``date``| Date | Yes | Date of the bot upload to DBL |
   * |``certifiedBot``| Boolean | Yes | If the bot is verified or not |
   * |``vanity``| String | No | The vanity URL of the bot server |
   * |``points``| Number | Yes | Number of upvotes/points the bot has |
   */
  public getBot(id: string): Promise<DBLAPI.Bot>;
  /**
   * ## Fetches a user by ID ``.getUser()``
   *
   * ## Example
   * ```
   *dbl.getUser("95579865788456960").then(user => {
   *    console.log(user.username) // "Tonkku"
   *});
   * ```
   * ## Returns Object
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``id``| Number | Yes | The id of the user |
   * |``username``| String | Yes | Username of the user |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the user |
   * |``avatar``| String | No | Avatar hash |
   * |``defAvatar``| String | Yes | Default avatar hash |
   * |``bio``| String | No | The bio of the user |
   * |``banner``| String | No | The URL banner of the user |
   * |``social``| Object | Yes | The object containing socials of the user |
   * |``social.youtube``| String | Yes | Empty string or youtube link |
   * |``social.reddit``| String | Yes | Empty string or reddit link |
   * |``social.twitter``| String | Yes | Empty string or twitter link |
   * |``social.instagram``| String | Yes | Empty string or instagram link |
   * |``social.github``| String | Yes | Empty string or github link |
   * |``color``| String | No | The hex code color |
   * |``supporter``| Boolean | Yes | If the user is a supporter |
   * |``certifiedDev``| Boolean | Yes | If the user is a certified developer |
   * |``mod``| Boolean | Yes | If the user is a mod |
   * |``webMod``| Boolean | Yes | If the user is a website developer |
   * |``admin``| Boolean | Yes | If the user is an admin |
   */
  public getUser(id: string): Promise<DBLAPI.User>;
  /**
   * ## Fetches bot(s) with a query ``.getBots()``
   *
   * ## Example
   * ```
   *dbl.getBots({sort: 'points', limit: 5}).then(bots => {
   *    console.log(bots.results.length) // 5
   *    console.log(bots.results[0].username) // "Pokécord"
   *});
   * ```
   *
   * ## Parameters
   * | Parameter | Type | Optional | Description |
   * | --- | --- | --- | --- |
   * | ``limit`` | Number | Yes | The amount of bots to return. Max. 500. Default 50 |
   * | ``offset`` | Number | Yes | Amount of bots to skip. Default 0 |
   * | ``search`` | String | No | A search string in the format of ``field: value field2: value2`` |
   * | ``sort`` | String | No | The field to sort by. Prefix with - to reverse the order |
   * | ``fields`` | String | Yes | A comma separated list of fields to show. |
   *
   *
   * ## Returns Object
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``results``| Array<Bot> | Yes | The Array containing matched bots |
   * |``limit``| Number | Yes | The limit used |
   * |``offset``| Number | Yes | The offset used |
   * |``count``| Number | Yes | The length of the results array |
   * |``total``| Number | Yes | The total number of bots matching your search |
   */

  public getBots(query: DBLAPI.BotsQuery): Promise<DBLAPI.BotSearchResult>;
  /**
   * ## Fetches your bot Votes ``.getVotes()``
   *
   * ## Example
   * ```
   *dbl.getVotes().then(votes => {
   * if (votes.find(vote => vote.id == "95579865788456960")) console.log("Tonkku has voted!!!")
   *});
   * ```
   * # ``WARNING``
   * #### For bots that have more than 1000 votes last month, USE WEBHOOKS!
   * ## Parameters
   * | Parameter | Type | Optional | Description |
   * | --- | --- | --- | --- |
   * | ``limit`` | Number | Yes | The amount of bots to return. Max. 500. Default 50 |
   * | ``offset`` | Number | Yes | Amount of bots to skip. Default 0 |
   * | ``search`` | String | No | A search string in the format of ``field: value field2: value2`` |
   * | ``sort`` | String | No | The field to sort by. Prefix with - to reverse the order |
   * | ``fields`` | String | Yes | A comma separated list of fields to show. |
   *
   * ## Returns Array of Objects
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``username``| String | Yes | The user username |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the user |
   * |``id``| String | Yes | The user id |
   * |``avatar``| String | Yes | The user avatar hash |
   */
  public getVotes(): Promise<DBLAPI.Vote[]>;
  /**
   * ## Checks if user has voted ``.hasVoted()``
   *
   * ## Example
   * ```
   *dbl.hasVoted("95579865788456960").then(voted => {
   *    if (voted) console.log("Tonkku has voted!!!")
   *});
   * ```
   * ## Returns Boolean
   */
  public hasVoted(id: string): Promise<boolean>;
  /**
   * ## Checks if weekend multiplier is active ``.isWeekend()``
   *
   * ## Example
   * ```
   *dbl.isWeekend().then(weekend => {
   *    if (weekend) console.log("Woo! Multiplier time!")
   *});
   * ```
   * ## Returns Boolean
   */
  public isWeekend(): Promise<boolean>;

  public token?: string;

  private _request(
    method: string,
    endpoint: string,
    data?: object
  ): Promise<object>;

  public on(event: 'posted', listener: () => void): this;
  public on(event: 'error', listener: (error: Error) => void): this;
}

import { Server, ServerResponse, IncomingMessage } from 'http';
declare class DBLWebhook extends EventEmitter {
  constructor(port?: number, path?: string, auth?: string, server?: Server);
  /**
   * The port at which the webhook should run on.
   * Typeof Number
   */
  public port: number;
  /**
   * The path for the webhook.
   * Typeof String
   */
  public path: string;
  /**
   * The string for Authorization you set on the site for verification for the webhook.
   * Typeof String
   * Optional
   */
  public auth?: string;
  private _server: Server;
  private attached: boolean;
  private _emitListening(): void;
  private _startWebhook(): void;
  private _attachWebhook(server: Server): void;
  private _handleRequest(req: IncomingMessage, res: ServerResponse): void;
  private _returnResponse(
    res: ServerResponse,
    statusCode: number,
    data?: string
  ): void;

  public on(
    event: 'ready',
    listener: (hook: DBLAPI.ReadyEventArgs) => void
  ): this;
  public on(
    event: 'vote',
    listener: (vote: DBLAPI.VoteEventArgs) => void
  ): this;
}

declare namespace DBLAPI {
  /**
   * ## DBL Options
   * Typeof = ``{ Object }``
   *
   * All options are optional
   *
   *
   * | Parameter | Type | Description |
   * | --- | --- | --- |
   * | ``options.setInterval`` | Number | How often the autoposter should post stats in ms. May not be smaller than 900000 (15 minutes). Default: ``1800000`` (30 minutes)
   * | ``options.webhookPort`` | Number | The port to run the webhook on. Will activate webhook when set. |
   * | ``options.webhookAuth`` | String | The string for Authorization you set on the site for verification. |
   * | ``options.webhookPath`` | String | The path for the webhook request. Default: ``'/dblwebhook'`` |
   * | ``options.webhookServer`` | http.Server | An existing server to run the webhook on. Will activate webhook when set.  |
   *
   */
  export type DBLOptions = {
    statsInterval?: number;
    webhookPort?: number;
    webhookAuth?: string;
    webhookPath?: string;
    webhookServer?: Server;
  };

  /**
   * ## Bot Stats
   *
   * Stats returned by the DBL API
   *
   * ### Example
   * ```
   *dbl.getStats("264811613708746752").then(stats => {
   *  console.log(stats) // {"server_count":2,"shards":[]}
   *});
   * ```
   *
   * | Property | Type | Always Present | Description |
   * | --- | --- | --- | --- |
   * | ``server_count`` | Number | No | The server count of the bot. |
   * | ``shards`` | Array<Number> | Yes | The shards of this bot OR empty array. |
   * | ``shard_count`` | Number | Yes | The count of all shards of the bot. |
   */
  export type BotStats = {
    server_count: number;
    shards: number[];
    shard_count: number;
  };
  /**
   * ## Returned object from ``.getBot()``
   *
   * ## Example
   * ```
   * dbl.getBot("264811613708746752").then(bot => {
   *    console.log(bot.username) // "Luca"
   *});
   * ```
   *
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``id``| Number | Yes | The id of the bot |
   * |``username``| String | Yes | Username of the bot |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the bot |
   * |``avatar``| String | No | Avatar hash |
   * |``defAvatar``| String | Yes | Default avatar hash |
   * |``lib``| String | Yes | The library the bot is using |
   * |``prefix``| String | Yes | The bot prefix |
   * |``shortdesc``| String | Yes | The short description of the bot |
   * |``longdesc``| String | Yes | The long description of the bot |
   * |``tags``| Array<String> | Yes | The array of tag(s) of the bot |
   * |``website``| String | No | The website linked at the bots DBL page |
   * |``support``| String | No | The discord support ending. Ex: 'KYZsaFb'. Add this to discord.gg/'ending' |
   * |``github``| String | No | The repository of the bot |
   * |``owners``| Array<String> | Yes | The array of owners of the bot |
   * |``invite``| String | Yes | The invite url for the bot |
   * |``date``| Date | Yes | Date of the bot upload to DBL |
   * |``certifiedBot``| Boolean | Yes | If the bot is verified or not |
   * |``vanity``| String | No | The vanity URL of the bot server |
   * |``points``| Number | Yes | Number of upvotes/points the bot has |
   */
  export type Bot = {
    id: string;
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
    owners: string[];
    invite?: string;
    date: Date;
    certifiedBot: boolean;
    vanity?: string;
    points: number;
  };

  /**
   * ## Returned object from ``.getUser()``
   *
   * ## Example
   * ```
   *dbl.getUser("95579865788456960").then(user => {
   *    console.log(user.username) // "Tonkku"
   *});
   * ```
   *
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``id``| Number | Yes | The id of the user |
   * |``username``| String | Yes | Username of the user |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the user |
   * |``avatar``| String | No | Avatar hash |
   * |``defAvatar``| String | Yes | Default avatar hash |
   * |``bio``| String | No | The bio of the user |
   * |``banner``| String | No | The URL banner of the user |
   * |``social``| Object | Yes | The object containing socials of the user |
   * |``social.youtube``| String | Yes | Empty string or youtube link |
   * |``social.reddit``| String | Yes | Empty string or reddit link |
   * |``social.twitter``| String | Yes | Empty string or twitter link |
   * |``social.instagram``| String | Yes | Empty string or instagram link |
   * |``social.github``| String | Yes | Empty string or github link |
   * |``color``| String | No | The hex code color |
   * |``supporter``| Boolean | Yes | If the user is a supporter |
   * |``certifiedDev``| Boolean | Yes | If the user is a certified developer |
   * |``mod``| Boolean | Yes | If the user is a mod |
   * |``webMod``| Boolean | Yes | If the user is a website developer |
   * |``admin``| Boolean | Yes | If the user is an admin |
   */

  export type User = {
    id: string;
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
  };

  /**
   *## Returned partial object from ``.getUser()``
   *
   *
   * ## Example
   * ```
   *dbl.getUser("95579865788456960").then(user => {
   *    console.log(user.socials) // { Object with socials }
   *});
   * ```
   *
   *
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``youtube``| String | Yes | Empty string or youtube link |
   * |``reddit``| String | Yes | Empty string or reddit link |
   * |``twitter``| String | Yes | Empty string or twitter link |
   * |``instagram``| String | Yes | Empty string or instagram link |
   * |``github``| String | Yes | Empty string or github link |
   */

  export type UserSocial = {
    youtube: '' | string;
    reddit: '' | string;
    twitter: '' | string;
    instagram: '' | string;
    github: '' | string;
  };
  /**
   * ## Query Parameters for ``.getBots()``
   *
   * ## Example
   * ```
   *dbl.getBots({sort: 'points', limit: 5}).then(bots => {
   *    console.log(bots.results.length) // 5
   *    console.log(bots.results[0].username) // "Pokécord"
   *});
   * ```
   *
   * ## Object Parameters
   * | Parameter | Type | Optional | Description |
   * | --- | --- | --- | --- |
   * | ``limit`` | Number | Yes | The amount of bots to return. Max. 500. Default 50 |
   * | ``offset`` | Number | Yes | Amount of bots to skip. Default 0 |
   * | ``search`` | String | No | A search string in the format of ``field: value field2: value2`` |
   * | ``sort`` | String | No | The field to sort by. Prefix with - to reverse the order |
   * | ``fields`` | String | Yes | A comma separated list of fields to show. |
   */
  export type BotsQuery = {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
  };
  /**
   * ## Returned object from ``.getBots()``
   *
   * ## Example
   * ```
   *dbl.getBots({sort: 'points', limit: 5}).then(bots => {
   *    console.log(bots.results.length) // 5
   *    console.log(bots.results[0].username) // "Pokécord"
   *});
   * ```
   *
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``results``| Array<Bot> | Yes | The Array containing matched bots |
   * |``limit``| Number | Yes | The limit used |
   * |``offset``| Number | Yes | The offset used |
   * |``count``| Number | Yes | The length of the results array |
   * |``total``| Number | Yes | The total number of bots matching your search |
   */
  export type BotSearchResult = {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  /**
   * ## Returned Object in ``.getVotes()``
   *
   * ## Example
   * ```
   *dbl.getVotes().then(votes => {
   * if (votes.find(vote => vote.id == "95579865788456960")) console.log("Tonkku has voted!!!")
   *});
   * ```
   *
   * | Property | Type | Always present | Description |
   * | --- | --- | --- | --- |
   * |``username``| String | Yes | The user username |
   * |``discriminator``| String | Yes | The discriminator(#0001) of the user |
   * |``id``| String | Yes | The user id |
   * |``avatar``| String | Yes | The user avatar hash |
   */
  export type Vote = {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
  };

  export type VoteEventArgs = {
    bot: string;
    user: string;
    type: string;
    isWeekend: boolean;
    query?: object;
  };

  export type ReadyEventArgs = {
    hostname: string;
    port: number;
    path: string;
  };
}
