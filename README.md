# Top.gg Node.js SDK

The community-maintained Node.js library for Top.gg.

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

### Getting your bot's voters

#### First page

```js
const voters = await client.getVotes();
```

#### Subsequent pages

```js
const voters = await client.getVotes(2);
```

### Check if a user has voted for your bot

```js
const hasVoted = await client.hasVoted("205680187394752512");
```

### Getting your bot's server count

```js
const { serverCount } = await client.getStats();
```

### Posting your bot's server count

```js
await client.postStats({
  serverCount: bot.getServerCount()
});
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
  console.log("Posted stats to Top.gg!");
});
```

#### ES module

```js
import { AutoPoster } from "topgg-autoposter";

// Your discord.js client or any other
const client = Discord.Client();

AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
  console.log("Posted stats to Top.gg!");
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