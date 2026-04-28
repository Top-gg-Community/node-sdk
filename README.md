# Top.gg Node.js SDK

> For more information, see the documentation here: <https://topgg.js.org>.

The community-maintained Node.js SDK for Top.gg.

## Chapters

- [Installation](#installation)
- [Setting up](#setting-up)
- [Usage](#usage)
  - [Getting your project's information](#getting-your-projects-information)
  - [Updating your project's information](#updating-your-projects-information)
  - [Getting your project's vote information of a user](#getting-your-projects-vote-information-of-a-user)
  - [Getting a cursor-based paginated list of votes for your project](#getting-a-cursor-based-paginated-list-of-votes-for-your-project)
  - [Posting an announcement for your project](#posting-an-announcement-for-your-project)
  - [Posting your project's metric stats](#posting-your-projects-metric-stats)
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

### Updating your project's information

```js
await client.editSelf({
  headline: {
    "en": "A great bot with tons of features!"
  },
  content: {
    "en": "# Welcome\nThis is the full page description for your project..."
  }
});
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
const since = new Date("2026-01-01");

const firstPage = await client.getVotes(since);
console.log(firstPage.votes);

const secondPage = await firstPage.next();
console.log(secondPage.votes);
```

### Posting an announcement for your project 

```js
const announcement = await client.postAnnouncement(
  "Version 2.0 Released!",
  "We just released version 2.0 with a bunch of new features and improvements."
);

console.log(announcement)
// =>
// {
//   title: "Version 2.0 Released!",
//   content: "We just released version 2.0 with a bunch of new features and improvements.",
//   createdAt: "2026-03-14T15:09:26Z"
// }
```

### Posting your project's metric stats

#### Single

```js
await client.postMetrics({ serverCount: 420, shardCount: 53 });
```

#### Batch

```js
await client.postMetrics([
  {
    timestamp: "2026-04-17T10:00:00Z",
    serverCount: 420,
    shardCount: 53
  },
  {
    serverCount: 435
  }
]);
```

### Posting your bot's application commands list

#### Discord.js

```js
const commands = (await bot.application.commands.fetch()).map(command => command.toJSON());

await client.postCommands(commands);
```

#### Raw

```js
// Array of application commands that
// can be serialized to Discord API's raw JSON format.
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
const widgetUrl = Topgg.Widget.large("discord", "bot", "1026525568344264724");
```

#### Votes

```js
const widgetUrl = Topgg.Widget.votes("discord", "bot", "1026525568344264724");
```

#### Owner

```js
const widgetUrl = Topgg.Widget.owner("discord", "bot", "1026525568344264724");
```

#### Social

```js
const widgetUrl = Topgg.Widget.social("discord", "bot", "1026525568344264724");
```

### Webhooks

With express:

```js
import { Webhook } from "@top-gg/sdk";
import express from "express";

const app = express();
const webhook = new Webhook(process.env.TOPGG_WEBHOOK_SECRET);

// POST /webhook
app.post("/webhook", webhook.listener((payload) => {
  console.log(payload);
}));

app.listen(8080);
```