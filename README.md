# Top.gg Node.js SDK

> For more information, see the documentation here: https://topgg.js.org.

The community-maintained Node.js library for Top.gg.

## Chapters

- [Installation](#installation)
- [Setting up](#setting-up)
- [Usage](#usage)
  - [Getting your project's information](#getting-your-projects-information)
  - [Getting your project's vote information of a user](#getting-your-projects-vote-information-of-a-user)
  - [Getting a cursor-based paginated list of votes for your project](#getting-a-cursor-based-paginated-list-of-votes-for-your-project)
  - [Posting your bot's application commands list](#posting-your-bots-application-commands-list)
  - [Generating widget URLs](#generating-widget-urls)
  - [Webhooks](#webhooks)

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

```js
import Topgg from "@top-gg/sdk";

const client = new Topgg.Api(process.env.TOPGG_TOKEN);
```

## Usage

### Getting your project's information

```js
const project = await client.getSelf();

console.log(project);
// =>
// {
//   id: '218109768489992192',
//   name: 'Miki',
//   type: 'bot',
//   platform: 'discord',
//   headline: 'A great bot with tons of features! language | admin | cards | fun | levels | roles | marriage | currency | custom commands!',
//   tags: [
//     'anime',
//     'customizable-behavior',
//     'economy',
//     'fun',
//     'game',
//     'leveling',
//     'multifunctional',
//     'role-management',
//     'roleplay',
//     'social'
//   ],
//   votes: { current: 1120, total: 313389 },
//   review: { score: 4.38, count: 62245 }
// }
```

### Getting your project's vote information of a user

#### Discord ID

```js
const vote = await client.getVote("661200758510977084");
```

#### Top.gg ID

```js
const vote = await client.getVote("8226924471638491136", "topgg");
```

### Getting a cursor-based paginated list of votes for your project

```js
const firstPage = await client.getVotes(new Date("2026-01-01"));
console.log(firstPage.votes);

const secondPage = await firstPage.next();
console.log(secondPage.votes);
```

### Posting your bot's application commands list

#### Discord.js

```js
const commands = (await bot.application.commands.fetch()).map(cmd => cmd.toJSON());

await client.postCommands(commands);
```

#### Eris

```js
const commands = await bot.getCommands();

await client.postCommands(commands);
```

#### Discordeno

```js
import { getApplicationCommands } from "discordeno";

const commands = await getApplicationCommands(bot);

await client.postCommands(commands);
```

#### Harmony

```js
const commands = await bot.interactions.commands.all();

await client.postCommands(commands);
```

#### Oceanic

```js
const commands = await bot.application.getGlobalCommands();

await client.postCommands(commands);
```

#### Raw

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

With express:

```js
import { Webhook } from "@top-gg/sdk";
import express from "express";

const app = express();
const webhook = new Webhook(process.env.TOPGG_WEBHOOK_PASSWORD);

app.post("/webhook", webhook.listener((payload) => {
  if (payload.type === "vote.create") {
    console.log(payload.data.user);
  }
}));

app.listen(8080);
```