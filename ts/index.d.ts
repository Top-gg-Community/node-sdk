export declare class Stats {
    server_count: number;
    shards: any[];
}

export declare class Bot {
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

export declare class User {
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
    webMod; boolean;
    admin: boolean;
}

export declare class UserSocial {
    youtube?: string;
    reddit?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
}

export declare class BotsQuery {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
}

export declare class Bots {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
}

export declare class Votes {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
}
