# dblapi.js
A module for interacting with the discordbots.org API

## Installation
`npm install dblapi.js`

## Documentation
Documentation can be found [here](https://discordbots.org/api/docs#jslib)

## Example
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL('Your discordbots.org token');

client.on('ready', () => {
    setInterval(() => {
        dbl.postStats(client.guilds.size);
    }, 1800000);
});
```
or we can take care of stat posting for you (discord.js / Eris)
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL('Your discordbots.org token', client);
```