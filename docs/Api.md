<a name="Api"></a>

## Api
Top.gg API Client for Posting stats or Fetching data

**Kind**: global class  
**Link**: https://top.gg/api/docs  

* [Api](#Api)
    * [new Api(token, options)](#new_Api_new)
    * [.postStats(stats)](#Api+postStats) ⇒ <code>BotStats</code>
    * [.getStats(id)](#Api+getStats) ⇒ <code>BotStats</code>
    * [.getBot(id)](#Api+getBot) ⇒ <code>BotInfo</code>
    * [.getUser(id)](#Api+getUser) ⇒ <code>UserInfo</code>
    * [.getBots(query)](#Api+getBots) ⇒ <code>BotsResponse</code>
    * [.getVotes()](#Api+getVotes) ⇒ <code>Array.&lt;ShortUser&gt;</code>
    * [.hasVoted(id)](#Api+hasVoted) ⇒ <code>Boolean</code>
    * [.isWeekend()](#Api+isWeekend) ⇒ <code>Boolean</code>

<a name="new_Api_new"></a>

### new Api(token, options)
Create Top.gg API instance


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Token or options |
| options | <code>object</code> | API Options |

**Example**  
```js
const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api('Your top.gg token')
```
<a name="Api+postStats"></a>

### api.postStats(stats) ⇒ <code>BotStats</code>
Post bot stats to Top.gg (Do not use if you supplied a client)

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>BotStats</code> - Passed object  

| Param | Type | Description |
| --- | --- | --- |
| stats | <code>Object</code> | Stats object |
| stats.serverCount | <code>number</code> | Server count |
| stats.shardCount | <code>number</code> | Shard count |
| stats.shardId | <code>number</code> | Posting shard (useful for process sharding) |

**Example**  
```js
await client.postStats({
  serverCount: 28199,
  shardCount: 1
})
```
<a name="Api+getStats"></a>

### api.getStats(id) ⇒ <code>BotStats</code>
Get a bots stats

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>BotStats</code> - Stats of bot requested  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Snowflake</code> | Bot ID |

**Example**  
```js
await client.getStats('461521980492087297')
// =>
{
  serverCount: 28199,
  shardCount 1,
  shards: []
}
```
<a name="Api+getBot"></a>

### api.getBot(id) ⇒ <code>BotInfo</code>
Get bot info

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>BotInfo</code> - Info for bot  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Snowflake</code> | Bot ID |

**Example**  
```js
await client.getBot('461521980492087297') // returns bot info
```
<a name="Api+getUser"></a>

### api.getUser(id) ⇒ <code>UserInfo</code>
Get user info

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>UserInfo</code> - Info for user  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Snowflake</code> | User ID |

**Example**  
```js
await client.getUser('205680187394752512')
// =>
user.username // Xignotic
```
<a name="Api+getBots"></a>

### api.getBots(query) ⇒ <code>BotsResponse</code>
Get a list of bots

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>BotsResponse</code> - Return response  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>BotsQuery</code> | Bot Query |

**Example**  
```js
// Finding by properties
await client.getBots({
  search: {
    username: 'shiro',
    certifiedBot: true
    ...any other bot object properties
  }
})
// =>
{
  results: [
    {
      id: '461521980492087297',
      username: 'Shiro',
      discriminator: '8764',
      lib: 'discord.js',
      ...rest of bot object
    }
    ...other shiro knockoffs B)
  ],
  limit: 10,
  offset: 0,
  count: 1,
  total: 1
}
// Restricting fields
await client.getBots({
  fields: ['id', 'username']
})
// =>
{
  results: [
    {
      id: '461521980492087297',
      username: 'Shiro'
    },
    {
      id: '493716749342998541',
      username: 'Mimu'
    },
    ...
  ],
  ...
}
```
<a name="Api+getVotes"></a>

### api.getVotes() ⇒ <code>Array.&lt;ShortUser&gt;</code>
Get users who've voted

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Array.&lt;ShortUser&gt;</code> - Array of users who've voted  
**Example**  
```js
await client.getVotes()
// =>
[
  {
    username: 'Xignotic',
    discriminator: '0001',
    id: '205680187394752512',
    avatar: '3b9335670c7213b3a2d4e990081900c7'
  },
  {
    username: 'iara',
    discriminator: '0001',
    id: '395526710101278721',
    avatar: '3d1477390b8d7c3cec717ac5c778f5f4'
  }
  ...more
]
```
<a name="Api+hasVoted"></a>

### api.hasVoted(id) ⇒ <code>Boolean</code>
Get whether or not a user has voted in the last 12 hours.

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Boolean</code> - Whether the user has voted in the last 12 hours.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Snowflake</code> | User ID |

**Example**  
```js
await client.hasVoted('205680187394752512')
// => true/false
```
<a name="Api+isWeekend"></a>

### api.isWeekend() ⇒ <code>Boolean</code>
Whether or not the weekend multiplier is active

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Boolean</code> - Whether the the multiplier is active  
**Example**  
```js
await client.isWeekend()
// => true/false
```
