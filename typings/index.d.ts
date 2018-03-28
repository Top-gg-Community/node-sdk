export = DBLAPI;

declare class DBLAPI {
	constructor(token: string, options?: DBLAPI.DBLOptions, client?: any)

	public postStats(serverCount: number, shardId?: number, shardCount?: number): Promise<Buffer>
	public getStats(id: string): Promise<DBLAPI.BotStats>
	public getBot(id: string): Promise<DBLAPI.Bot>
	public getUser(id: string): Promise<DBLAPI.User>
	public getBots(query: DBLAPI.BotsQuery): Promise<DBLAPI.BotSearchResult>
	public getVotes(): Promise<DBLAPI.Votes[]>
	public hasVoted(id: string): Promise<boolean>

	public token?: string;

	private _request(method: string, endpoint: string, data?: Object, auth?: boolean): Promise<Object>
}

declare namespace DBLAPI {
	export type DBLOptions = {
		statsInterval?: number;
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

	export type BotsQuery ={
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

	export type Votes = {
		username: string;
		discriminator: string;
		id: string;
		avatar: string;
	}
}
