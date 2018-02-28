declare module "dblapi.js" {
	export class DBLAPI {
		constructor(token: string, client?: any)
		
		public postStats(serverCount: number, shardId?: number, shardCount?: number): Promise<Buffer>
		public getStats(id: string): Promise<BotStats>
		public getBot(id: string): Promise<Bot>
		public getUser(id: string): Promise<User>
		public getBots(query: BotsQuery): Promise<BotSearchResult>
		public getVotes(onlyids?: boolean, days?: number): Promise<Votes[]>
		public hasVoted(id: string): Promise<boolean>

		public token?: string;
	
		private _request(method: string, endpoint: string, data?: Object, auth?: boolean): Promise<Buffer>
	}

	type BotStats = {
		server_count: number;
		shards: number[];
		shard_count: number;
	}
		
	type Bot = {
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
		
	type User = {
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
		
	type UserSocial = {
		youtube?: string;
		reddit?: string;
		twitter?: string;
		instagram?: string;
		github?: string;
	}
		
	type BotsQuery ={
		limit?: number;
		offset?: number;
		search: string;
		sort: string;
		fields?: string;
	}
		
	type BotSearchResult = {
		results: Bot[];
		limit: number;
		offset: number;
		count: number;
		total: number;
	}
		
	type Votes = {
		username: string;
		discriminator: string;
		id: string;
		avatar: string;
	}
}
