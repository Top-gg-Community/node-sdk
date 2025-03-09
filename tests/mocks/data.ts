// https://docs.top.gg/api/bot/#find-one-bot
export const BOT = {
  invite: "https://top.gg/discord",
  support: "https://discord.gg/dbl",
  github: "https://github.com/top-gg",
  longdesc:
    "A bot to grant API access to our Library Developers on the Top.gg site without them needing to submit a bot to pass verification just to be able to access the API. \n" +
    "\n" +
    "Access to this bot's team can be requested by contacting a Community Manager in [our Discord server](https://top.gg/discord).",
  shortdesc: "API access for Top.gg Library Developers",
  prefix: "/",
  clientid: "1026525568344264724",
  avatar:
    "https://cdn.discordapp.com/avatars/1026525568344264724/cd70e62e41f691f1c05c8455d8c31e23.png",
  id: "1026525568344264724",
  username: "Top.gg Lib Dev API Access",
  date: "2022-10-03T16:08:55.000Z",
  server_count: 2,
  monthlyPoints: 4,
  points: 18,
  owners: ["491002268401926145"],
  tags: ["api", "library", "topgg"],
  reviews: { averageScore: 5, count: 2 }
};

// https://docs.top.gg/api/bot/#search-bots
export const BOTS = {
  limit: 0,
  offset: 0,
  count: 1,
  total: 1,
  results: [BOT]
};

// https://docs.top.gg/api/bot/#last-1000-votes
export const VOTES = [
  {
    username: "Xetera",
    id: "140862798832861184",
    avatar:
      "https://cdn.discordapp.com/avatars/1026525568344264724/cd70e62e41f691f1c05c8455d8c31e23.png"
  }
];

// https://docs.top.gg/api/bot/#bot-stats
export const BOT_STATS = {
  server_count: 0,
  shards: [],
  shard_count: null
};

// https://docs.top.gg/api/bot/#individual-user-vote
export const USER_VOTE = {
  voted: 1
};

export const USER_VOTE_CHECK = {
  voted: 1
};

// Undocumented 😢
export const WEEKEND = {
  is_weekend: true
};
