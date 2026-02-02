# Top.gg Node.js SDK

> For more information, see the documentation here: https://topgg.js.org.

The community-maintained Node.js library for Top.gg.

## Chapters

- [Installation](#installation)
- [Setting up](#setting-up)
- [Usage](#usage)
  - [Getting your project's vote information of a user](#getting-your-projects-vote-information-of-a-user)
  - [Posting your bot's application commands list](#posting-your-bots-application-commands-list)
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

```js
import Topgg from "@top-gg/sdk";

const client = new Topgg.Api(process.env.TOPGG_TOKEN);
```

## Usage

### Getting your project's vote information of a user

#### Discord ID

```js
const vote = await client.getVote("661200758510977084");
```

#### Top.gg ID

```js
const vote = await client.getVote("8226924471638491136", "topgg");
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