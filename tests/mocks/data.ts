// https://docs.top.gg/api/bot/#find-one-bot
export const BOT = {
  "defAvatar": "6debd47ed13483642cf09e832ed0bc1b",
  "invite": "",
  "website": "https://discordbots.org",
  "support": "KYZsaFb",
  "github": "https://github.com/DiscordBotList/Luca",
  "longdesc": "Luca only works in the **Discord Bot List** server.    \r\nPrepend commands with the prefix `-` or `@Luca#1375`.    \r\n**Please refrain from using these commands in non testing channels.**\r\n- `botinfo @bot` Shows bot info, title redirects to site listing.\r\n- `bots @user`* Shows all bots of that user, includes bots in the queue.\r\n- `owner / -owners @bot`* Shows all owners of that bot.\r\n- `prefix @bot`* Shows the prefix of that bot.\r\n* Mobile friendly version exists. Just add `noembed` to the end of the command.\r\n",
  "shortdesc": "Luca is a bot for managing and informing members of the server",
  "prefix": "- or @Luca#1375",
  "lib": "discord.js",
  "clientid": "264811613708746752",
  "avatar": "7edcc4c6fbb0b23762455ca139f0e1c9",
  "id": "264811613708746752",
  "discriminator": "1375",
  "username": "Luca",
  "date": "2017-04-26T18:08:17.125Z",
  "server_count": 2,
  "guilds": ["417723229721853963", "264445053596991498"],
  "shards": [],
  "monthlyPoints": 19,
  "points": 397,
  "certifiedBot": false,
  "owners": ["129908908096487424"],
  "tags": ["Moderation", "Role Management", "Logging"],
  "donatebotguildid": ""
}

// https://docs.top.gg/api/bot/#search-bots
export const BOTS = {
  limit: 0,
  offset: 0,
  count: 1,
  total: 1,
  results: [BOT],
}

// https://docs.top.gg/api/bot/#last-1000-votes
export const VOTES = [
  {
    "username": "Xetera",
    "id": "140862798832861184",
    "avatar": "a_1241439d430def25c100dd28add2d42f"
  }
]

// https://docs.top.gg/api/bot/#bot-stats
export const BOT_STATS = {
  server_count: 0,
  shards: ['200'],
  shard_count: 1
}

// https://docs.top.gg/api/bot/#individual-user-vote
export const USER_VOTE = {
  "voted": 1
}

// https://docs.top.gg/api/user/#structure
export const USER = {
  "discriminator": "0001",
  "avatar": "a_1241439d430def25c100dd28add2d42f",
  "id": "140862798832861184",
  "username": "Xetera",
  "defAvatar": "322c936a8c8be1b803cd94861bdfa868",
  "admin": true,
  "webMod": true,
  "mod": true,
  "certifiedDev": false,
  "supporter": false,
  "social": {}
}

export const USER_VOTE_CHECK = { 
  voted: 1 
}

// Undocumented 😢
export const WEEKEND = {
  is_weekend: true
}

