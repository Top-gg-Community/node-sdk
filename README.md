# Top.gg Node.js SDK

> For more information, see the documentation here: https://topgg.js.org.

The community-maintained Node.js library for Top.gg.

## Chapters

- [Installation](#installation)
- [Setting up](#setting-up)
- [Usage](#usage)
  - [API v1](#api-v1)
    - [Getting your project's vote information of a user](#getting-your-projects-vote-information-of-a-user)
    - [Posting your bot's application commands list](#posting-your-bots-application-commands-list)
  - [API v0](#api-v0)
    - [Getting a bot](#getting-a-bot)
    - [Getting several bots](#getting-several-bots)
    - [Getting your project's voters](#getting-your-projects-voters)
    - [Check if a user has voted for your project](#check-if-a-user-has-voted-for-your-project)
    - [Getting your bot's statistics](#getting-your-bots-statistics)
    - [Posting your bot's statistics](#posting-your-bots-statistics)
    - [Automatically posting your bot's statistics every few minutes](#automatically-posting-your-bots-statistics-every-few-minutes)
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


### v1

:::note
API v1 also includes API v0.
:::

```js
import Topgg from "@top-gg/sdk";

const client = new Topgg.V1Api(process.env.TOPGG_TOKEN);
```

### v0

```js
import Topgg from "@top-gg/sdk";

const client = new Topgg.Api(process.env.TOPGG_TOKEN);
```

## Usage

### API v1

#### Getting your project's vote information of a user


##### Discord ID

```js
const vote = await client.getVote("661200758510977084");
```

##### Top.gg ID

```js
const vote = await client.getVote("8226924471638491136", "topgg");
```

#### Posting your bot's application commands list


##### Discord.js

```js
const commands = (await bot.application.commands.fetch()).map(cmd => cmd.toJSON());

await client.postCommands(commands);
```

##### Eris

```js
const commands = await bot.getCommands();

await client.postCommands(commands);
```

##### Discordeno

```js
import { getApplicationCommands } from "discordeno";

const commands = await getApplicationCommands(bot);

await client.postCommands(commands);
```

##### Harmony

```js
const commands = await bot.interactions.commands.all();

await client.postCommands(commands);
```

##### Oceanic

```js
const commands = await bot.application.getGlobalCommands();

await client.postCommands(commands);
```

##### Raw

```js
await client.postCommands([
  {
    options: [],
    name: 'test',
    name_localizations: null,
    description: 'command description',
    description_localizations: null,
    contexts: [],
    default_permission: null,
    default_member_permissions: null,
    dm_permission: false,
    integration_types: [],
    nsfw: false
  }
]);
```

### API v0

#### Getting a bot

```js
const bot = await client.getBot("461521980492087297");
```

#### Getting several bots

```js
const bots = await client.getBots();
```

#### Getting your project's voters


##### First page

```js
const voters = await client.getVoters();
```

##### Subsequent pages

```js
//                                    Page number
const voters = await client.getVoters(2);
```

#### Check if a user has voted for your project

```js
const hasVoted = await client.hasVoted("661200758510977084");
```

#### Getting your bot's statistics

```js
const stats = await client.getStats();
```

#### Posting your bot's statistics

```js

await api.postStats({
  serverCount: bot.getServerCount(),
});
```

#### Automatically posting your bot's statistics every few minutes

You would need to use the third-party `topgg-autoposter` package to be able to autopost. Install it in your terminal like so:


##### NPM

```sh
$ npm i topgg-autoposter
```

##### Yarn

```sh
$ yarn add topgg-autoposter
```

Then in your code:

```js
import { AutoPoster } from "topgg-autoposter";

// Your discord.js client or any other
const client = Discord.Client();

AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
  console.log("Successfully posted statistics to Top.gg!");
});
```

#### Checking if the weekend vote multiplier is active

```js
const isWeekend = await client.isWeekend();
```

#### Generating widget URLs


##### Large

```js
const widgetUrl = Topgg.Widget.large(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

##### Votes

```js
const widgetUrl = Topgg.Widget.votes(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

##### Owner

```js
const widgetUrl = Topgg.Widget.owner(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

##### Social

```js
const widgetUrl = Topgg.Widget.social(Topgg.WidgetType.DiscordBot, "574652751745777665");
```

### Webhooks

#### Being notified whenever someone voted for your project

With express:

```js
import { Webhook } from "@top-gg/sdk";
import express from "express";

const app = express();
const webhook = new Webhook(process.env.TOPGG_WEBHOOK_PASSWORD);

app.post("/votes", webhook.listener(vote => {
  console.log(`A user with the ID of ${vote.user} has voted us on Top.gg!`);
}));

app.listen(8080);
```