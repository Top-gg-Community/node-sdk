# dblapi.js
An official module for interacting with the discordbots.org API

## Installation
`npm install dblapi.js`

## Documentation
Documentation can be found [here](https://discordbots.org/api/docs#jslib)

## Example

### Example of posting server count with supported libraries (Discord.js and Eris)
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL('Your discordbots.org token', client);
```

### Example of using webhooks to receive vote updates
```js
const DBL = require('dblapi.js');
const dbl = new DBL(yourDBLTokenHere, { webhookPort: 5000, webhookAuth: 'password' });
dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
  console.log(`User with ID ${vote.user} just voted!`);
});
```