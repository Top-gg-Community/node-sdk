# Some code examples
  
## Autoposting example
  
### Auto posting status every x second
  
Using Ecmascript `import`:
  
```js
import { Client } from "discord.js"
import { Autopost } from "@top-gg/sdk"

const Bot = new Client()

const Autoposter = new Autopost("TOP.GG API TOKEN", Bot, (20*60*1000))

Bot.once("ready", () => {
    Autoposter.init()
    console.log("Bot is online")
})
Bot.login("DISCORD_BOT_TOKEN")
```
  
Using node `require`:
  
```js
const { Client } = require("discord.js");
const { Autopost } = require("@top-gg/sdk");

const Bot = new Client()

const Autoposter = new Autopost("TOP.GG API TOKEN", Bot, (20*60*1000))

Bot.once("ready", () => {
    Autoposter.init()
    console.log("Bot is online")
})
Bot.login("DISCORD_BOT_TOKEN")
```
  
### Using `post()` to post status instantly
  
```js
import { Client } from "discord.js"
import { Autopost } from "@top-gg/sdk"

const Bot = new Client()

const Autoposter = new Autopost("TOP.GG API TOKEN", Bot, (20*60*1000))

Bot.once("guildCreate", () => {
    Autoposter.post();
    console.log("Added to one more server");
})
Bot.once("guildDelete", () => {
    Autoposter.post();
    console.log("Removed from one server");
})
Bot.login("DISCORD_BOT_TOKEN")
```
  
## Webhook example
  
Using Ecmascript `import`:
  
```js
import express from "express"
import { Webhook } from "@top-gg/sdk"

const app = express()
const wh = new Webhook('webhookauth123')

app.post('/dblwebhook', wh.listener(vote => {
  // vote is your vote object
  console.log(vote.user) // => 321714991050784770
}))

app.listen(80)

// In this situation, your TopGG Webhook dashboard should look like
// URL = http://your.server.ip:80/dblwebhook
// Authorization: webhookauth123
```
  
Using node `require`:
  
```js
const express = require('express')
const { Webhook } = require(`@top-gg/sdk`)

const app = express()
const wh = new Webhook('webhookauth123')

app.post('/dblwebhook', wh.listener(vote => {
  // vote is your vote object
  console.log(vote.user) // => 321714991050784770
}))

app.listen(80)

// In this situation, your TopGG Webhook dashboard should look like
// URL = http://your.server.ip:80/dblwebhook
// Authorization: webhookauth123
```
  
In both examples your TopGG Webhook dashboard should look like:
  
```any
URL = http://your.server.ip:80/dblwebhook
Authorization: webhookauth123
```
  
![webhook_preview](https://i.imgur.com/YcGHDAM.png)
  
## Api example
  
### Importing and authorization
  
Using Ecmascript `import`:
  
```js
import { Api } from "@top-gg/sdk"

const api = new Api('Your top.gg AUTH TOKEN')
```
  
Using node `require`:
  
```js
const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api('Your top.gg token')
```
  
### Posting bot stats
  
```js
await api.postStats({
  serverCount: 28199,
  shardCount: 1
})
```
  
### Get stats of a bot
  
```js
api.getStats('461521980492087297').then(res => {
    console.log(res);
})
/*
{
  serverCount: 28199,
  shardCount 1,
  shards: []
}
*/
```

### Get bot info
  
```js
await api.getBot('461521980492087297'); //Returns Bot info
```

### Get User Info

```js
api.getUser('205680187394752512').then(user => {
    console.log(user.username); // Xignotic
})
```

### Searching bots with Query
  
Finding by properties:
  
```js
await api.getBots({
  search: {
    username: 'shiro',
    certifiedBot: true
    ...any other bot object properties
  }
})
/*
{
  results: [
    {
      id: '461521980492087297',
      username: 'Shiro',
      discriminator: '8764',
      lib: 'discord.js',
      ...rest of bot object
    }
    ...other shiro knockoffs B)
  ],
  limit: 10,
  offset: 0,
  count: 1,
  total: 1
}
*/
```
  
Restricting fields:
  
```js
await api.getBots({
  fields: ['id', 'username']
})
/*
{
  results: [
    {
      id: '461521980492087297',
      username: 'Shiro'
    },
    {
      id: '493716749342998541',
      username: 'Mimu'
    },
    ...
  ],
  ...
}
*/
```

### Get users who've voted

```js
api.getVotes().then(users => {
    console.log(users);
})
/*
[
  {
    username: 'Xignotic',
    discriminator: '0001',
    id: '205680187394752512',
    avatar: '3b9335670c7213b3a2d4e990081900c7'
  },
  {
    username: 'iara',
    discriminator: '0001',
    id: '395526710101278721',
    avatar: '3d1477390b8d7c3cec717ac5c778f5f4'
  }
  ...more
]
*/
```

### Check if a user has voted

```js
await api.hasVoted('205680187394752512')

// true / false
```

### Check if weekend multiplier is active or not

```js
await api.isWeekend()

// true / false
```
