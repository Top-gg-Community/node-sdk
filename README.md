# TopGG.js

An official module for interacting with the Top.<span>GG API

# Installation

`npm i @top-gg/sdk`

# Introduction

The base client is TopGG.API, and it takes your top.<span>gg token and an optional Discord client.

Your Top.<span>GG token can be found [here](https://top.gg/api/docs#mybots)

If the client is provided, the poster will auto-retrieve statistics and post them to top<span>.gg, otherwise you can use the `API#postStats(serverCount, shardId, shardCount)` to do it manually.

The client also comes with a suite of API interaction methods.

# Popular examples

## Auto-Posting stats

```js
const client = Discord.Client() // Your discord.js or Eris client

const TopGG = require('@top-gg/sdk')

const api = new TopGG.API('Your top.gg token', client)

api.on('posted', () => {
  console.log('Server count posted!')
})
```
With this your server count, and shard count, will be auto-posted to top<span>.gg, nothing else needs to be done

## Webhook server

```js
const express = require('express')
const TopGG = require('@top-gg/sdk')

const app = express() // Your express app

const webhook = new TopGG.Webhook('topggauth123') // add your top.gg webhook authorization (not bot token)

app.post('/dblwebhook', webhook.middleware()) // attach the middleware

app.listen(3000) // your port
```
With this example, your webhook dashboard should look like this:
![](https://i.imgur.com/wFlp4Hg.png)