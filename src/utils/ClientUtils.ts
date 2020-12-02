import '../typings'

/**
 * Client Type
 */
export enum ClientType {
  DiscordJS = 1,
  Eris
}

/**
 * Figure which client is being used
 */
function figureClient (client): ClientType {
  // Get library packages
  let DiscordJS
  try {
    DiscordJS = require.cache[require.resolve('discord.js')]
  } catch (err) {}
  
  let Eris
  try {
    Eris = require.cache[require.resolve('eris')]
  } catch (err) {}
  if (DiscordJS && client instanceof DiscordJS.exports.Client) return ClientType.DiscordJS
  if (Eris && client instanceof Eris.exports.Client) return ClientType.Eris
  else return null
}

/**
 * Client's User ID
 */
function id (client, clientType: ClientType): Snowflake {
  if (clientType === ClientType.DiscordJS) return client.user.id
  if (clientType === ClientType.Eris) return client.user.id
  return null
}

/**
 * Total server count on shard/client
 */
function serverCount (client, clientType: ClientType): number {
  if (clientType === ClientType.DiscordJS) return client.guilds.cache.size
  if (clientType === ClientType.Eris) return client.guilds.size
  return null
}

/**
 * Total shard count
 */
function shardCount (client, clientType: ClientType): number {
  if (clientType === ClientType.DiscordJS) return client.options.shardCount // https://github.com/discordjs/discord.js/blob/master/src/client/websocket/WebSocketShard.js#L603
  if (clientType === ClientType.Eris) return client.options.maxShards // https://github.com/abalabahaha/eris/blob/master/lib/gateway/Shard.js#L336
  return null
}

/**
 * Get current shard
 */
function currentShard (client, clientType: ClientType): number {
  if (clientType === ClientType.DiscordJS && client.shard) return client.shard.ids[0]
  return null
}

function isStarted (client, clientType: ClientType): boolean {
  if (clientType === ClientType.DiscordJS) return client.ws.status === 0
  if (clientType === ClientType.Eris) return client.ready
  return null
}

function setupAutoPoster (client, clientType: ClientType, fn: () => void) {
  if (isStarted(client, clientType)) fn()
  else {
    if (clientType === ClientType.DiscordJS) client.once('ready', fn)
    if (clientType === ClientType.Eris) client.once('ready', fn)
  }
}

export default {
  figureClient,
  id,
  serverCount,
  shardCount,
  currentShard,
  isStarted,
  setupAutoPoster,
  ClientType
}