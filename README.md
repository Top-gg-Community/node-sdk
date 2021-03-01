# Top.gg Node SDK

An official module for interacting with the Top.<span>gg API

# Installation

`yarn add @top-gg/sdk` or `npm i @top-gg/sdk`

# Introduction

The base client is Topgg.Api, and it takes your Top.<span>gg token and provides you with plenty of methods to interact with the API.

Your Top.<span>gg token can be found at `top.gg/bot/(BOT_ID)/webhooks` and copying the token.

You can also setup webhooks via Topgg.Webhook, look down below at the examples for how to do so!

# Links

[Documentation](https://topggjs.rtfd.io)

[API Reference](https://docs.top.gg) | [GitHub](https://github.com/top-gg/node-sdk) | [NPM](https://npmjs.com/package/@top-gg/sdk) | [Discord Server](https://discord.gg/EYHTgJX)

# Auto-Posting

If you're looking for an easy way to post your bot's stats (server count, shard count), check out [`topgg-autoposter`](https://npmjs.com/package/topgg-autoposter)

# Popular Examples

## Auto-Posting stats

If you choose not to use [`topgg-autoposter`](https://npmjs.com/package/topgg-autoposter) you can always do it yourself manually;

```js
const client = Discord.Client() // Your discord.js client

const Topgg = require('@top-gg/sdk')

const api = new Topgg.Api('Your top.gg token')

setInterval(() => {
  api.postStats({
    serverCount: client.guilds.cache.size,
    shardId: client.shard.ids[0], // if you're sharding
    shardCount: client.options.shardCount
  })
}, 1800000) // post every 30 minutes
```
With this your server count and shard count will be posted to top.<span>gg

## Webhook server

```js
const express = require('express')
const Topgg = require('@top-gg/sdk')

const app = express() // Your express app

const webhook = new Topgg.Webhook('topggauth123') // add your top.gg webhook authorization (not bot token)

app.post('/dblwebhook', webhook.middleware(), (req, res) => {
  // req.vote is your vote object e.g
  console.log(req.vote.user) // 221221226561929217
}) // attach the middleware

app.listen(3000) // your port
```
With this example, your webhook dashboard should look like this:
![](https://i.imgur.com/wFlp4Hg.png)
