# Some code examples
  
## Autoposting example
  
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
  
### Posting bot status
  
```js
await api.postStats({
  serverCount: 28199,
  shardCount: 1
})
```
