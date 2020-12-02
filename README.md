# Top.gg Node SDK

An official module for interacting with the Top.<span>gg API

# Installation

`yarn install @top-gg/sdk` or `npm i @top-gg/sdk`

# Introduction

The base client is Topgg.API, and it takes your top.<span>gg token and an optional Discord client.

Your Top.<span>gg token can be found [here](https://top.gg/api/docs#mybots)

If the client is provided, the poster will auto-retrieve statistics and post them to top<span>.gg, otherwise you can use the `API#postStats(serverCount, shardId, shardCount)` to do it manually.

The client also comes with a suite of API interaction methods.

# Links

[API Docs](https://top.gg/api/docs)

[GitHub](https://github.com/top-gg/node-sdk) | [NPM](https://npmjs.com/package/@top-gg/sdk) | [Discord Server](https://discord.gg/EYHTgJX)

# Popular examples

## Auto-Posting stats

```js
const client = Discord.Client() // Your discord.js client

const Topgg = require('@top-gg/sdk')

const api = new Topgg.Api('Your top.gg token')

setInterval(() => {
  api.postStats(client.guilds.cache.size, client.shard.ids[0], client.options.shardCount)
}, 1800000) // post every 30 minutes
```
With this your server count, and shard count, will be auto-posted to top<span>.gg, nothing else needs to be done

## Webhook server

```js
const express = require('express')
const Topgg = require('@top-gg/sdk')

const app = express() // Your express app

const webhook = new Topgg.Webhook('topggauth123') // add your top.gg webhook authorization (not bot token)

app.post('/dblwebhook', webhook.middleware()) // attach the middleware

app.listen(3000) // your port
```
With this example, your webhook dashboard should look like this:
![](https://i.imgur.com/wFlp4Hg.png)