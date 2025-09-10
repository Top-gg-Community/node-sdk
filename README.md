# Top.gg Node.js SDK

The community-maintained Node.js library for Top.gg.

## Chapters

- [Installation](#installation)
- [Setting up](#setting-up)
- [Usage](#usage)
  - [Getting a bot](#getting-a-bot)
  - [Getting several bots](#getting-several-bots)
  - [Getting your project's voters](#getting-your-projects-voters)
  - [Check if a user has voted for your project](#check-if-a-user-has-voted-for-your-project)
  - [Getting your bot's server count](#getting-your-bots-server-count)
  - [Posting your bot's server count](#posting-your-bots-server-count)
  - [Automatically posting your bot's server count every few minutes]#automatically-posting-your-bots-server-count-every-few-minutes)
  - [Checking if the weekend vote multiplier is active](#checking-if-the-weekend-vote-multiplier-is-active)
  - [Generating widget URLs](#generating-widget-urls)
  - [Webhooks](#webhooks)
    - [Being notified whenever someone voted for your project](#being-notified-whenever-someone-voted-for-your-project)

## Installation

### NPM

```sh
$ npm i @top-gg/sdk
```

### Yarn

```sh
$ yarn add @top-gg/sdk
```

## Setting up

### CommonJS

```js
const Topgg = require("@top-gg/sdk");

const client = new Topgg.Api(process.env.TOPGG_TOKEN);
```

### ES module

```js
import Topgg from "@top-gg/sdk";

const client = new Topgg.Api(process.env.TOPGG_TOKEN);
```

## Usage

### Getting a bot

```js
const bot = await client.getBot("461521980492087297");
```

### Getting several bots

```js
const bots = await client.getBots();
```

### Getting your project's voters

#### First page

```js
const voters = await client.getVoters();
```

#### Subsequent pages

```js
const voters = await client.getVoters(2);
```

### Getting your project's vote information of a user

```js
const vote = await client.getVote("8226924471638491136");
```

### Getting your bot's server count

```js
const serverCount = await client.getBotServerCount();
```

### Posting your bot's server count

```js
await client.postBotServerCount(bot.getServerCount());
```

### Posting your bot's application commands list

```js
// Discord.js:
const commands = (await bot.application.commands.fetch()).map(cmd => cmd.toJSON());

// Eris:
const commands = await bot.getCommands();

// Discordeno:
import { getApplicationCommands } from "discordeno";

const commands = await getApplicationCommands(bot);

// Harmony:
const commands = await bot.interactions.commands.all();

// Oceanic:
const commands = await bot.application.getGlobalCommands();

await client.postBotCommands(commands);
```

### Automatically posting your bot's server count every few minutes

You would need to use the third-party `topgg-autoposter` package to be able to autopost. Install it in your terminal like so:

#### NPM

```sh
$ npm i topgg-autoposter
```

#### Yarn

```sh
$ yarn add topgg-autoposter
```

Then in your code:

#### CommonJS

```js
const { AutoPoster } = require("topgg-autoposter");

// Your discord.js client or any other
const client = Discord.Client();

AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
  console.log("Successfully posted server count to Top.gg!");
});
```

#### ES module

```js
import { AutoPoster } from "topgg-autoposter";

// Your discord.js client or any other
const client = Discord.Client();

AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
  console.log("Successfully posted server count to Top.gg!");
});
```

### Checking if the weekend vote multiplier is active

```js
const isWeekend = await client.isWeekend();
```

### Generating widget URLs

#### Large

```js
const widgetUrl = Topgg.Widget.large(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

#### Votes

```js
const widgetUrl = Topgg.Widget.votes(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

#### Owner

```js
const widgetUrl = Topgg.Widget.owner(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

#### Social

```js
const widgetUrl = Topgg.Widget.social(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

### Webhooks

#### Being notified whenever someone voted for your project

With express:

##### CommonJS

```js
const { Webhook } = require("@top-gg/sdk");
const express = require("express");

const app = express();
const webhook = new Webhook(process.env.MY_TOPGG_WEBHOOK_SECRET);

app.post("/votes", webhook.voteListener(vote => {
  console.log(`A user with the ID of ${vote.voterId} has voted us on Top.gg!`);
}));

app.listen(8080);
```

##### ES module

```js
import { Webhook } from "@top-gg/sdk";
import express from "express";

const app = express();
const webhook = new Webhook(process.env.MY_TOPGG_WEBHOOK_SECRET);

app.post("/votes", webhook.voteListener(vote => {
  console.log(`A user with the ID of ${vote.voterId} has voted us on Top.gg!`);
}));

app.listen(8080);
```