const snekfetch = require('snekfetch');
const API = 'https://discordbots.org/api/';

const isLib = (library, client) => {
  try {
    const lib = require.cache[require.resolve(library)];
    return lib && client instanceof lib.exports.Client;
  } catch (e) {
    return false;
  }
};

const isASupportedLibrary = client => isLib('discord.js', client) || isLib('eris', client);

class DBLAPI {
  /**
   * Creates a new DBLAPI Instance.
   * @param {string} token Your discordbots.org token for this bot.
   * @param {Object} [options] Your DBLAPI options.
   * @param {number} [options.statsInterval=1800000] How often the autoposter should post stats in ms. May not be smaller than 900000 and defaults to 1800000.
   * @param {number} [options.webhookPort] The port to run the webhook on. Will activate webhook when set.
   * @param {string} [options.webhookAuth] The string for Authorization you set on the site for verification.
   * @param {string} [options.webhookPath='/dblwebhook'] The path for the webhook request.
   * @param {any} [client] Your Client instance, if present and supported it will auto update your stats every `options.statsInterval` ms.
   */
  constructor(token, options, client) {
    this.token = token;
    if (isASupportedLibrary(options)) {
      client = options;
      options = {};
    }
    this.options = options || {};

    if (client && isASupportedLibrary(client)) {
      if (!this.options.statsInterval) this.options.statsInterval = 1800000;
      if (this.options.statsInterval < 900000) throw new Error('statsInterval may not be shorter than 900000 (15 minutes)');

      this.client = client;
      this.client.on('ready', () => {
        this.postStats().catch(e => console.error(`[dblapi.js autopost] Failed to post stats: ${e.text}`)); // eslint-disable-line no-console
        setInterval(() => {
          this.postStats().catch(e => console.error(`[dblapi.js autopost] Failed to post stats: ${e.text}`)); // eslint-disable-line no-console
        }, this.options.statsInterval);
      });
    } else if (client) {
      console.error(`[dblapi.js autopost] The provided client is not supported. Please add an issue or pull request to the github repo https://github.com/DiscordBotList/dblapi.js`); // eslint-disable-line no-console
    }

    if (this.options.webhookPort) {
      const DBLWebhook = require('./webhook');
      this.webhook = new DBLWebhook(this.options.webhookPort, this.options.webhookPath, this.options.webhookAuth);
    }
  }

  /**
   * Creates the request with snekfetch.
   * @param {string} method Http method to use.
   * @param {string} endpoint API endpoint to use.
   * @param {Object} [data] Data to send with the request.
   * @param {boolean} [auth] Boolean indicating if auth is needed.
   * @private
   * @returns {Promise<snekfetch>}
   */
  _request(method, endpoint, data, auth) {
    const request = snekfetch[method](API + endpoint);
    if (method === 'post' && data) request.send(data);
    if (method === 'get' && data) request.query(data);
    if (auth) request.set({ Authorization: this.token });
    return request;
  }

  /**
   * Post Stats to Discord Bot List.
   * @param {number|number[]} serverCount The server count of your bot.
   * @param {number} [shardId] The ID of this shard.
   * @param {number} [shardCount] The count of all shards of your bot.
   * @returns {Promise<Object>}
   */
  async postStats(serverCount, shardId, shardCount) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (!serverCount && !this.client) throw new Error('postStats requires 1 argument');
    const data = {};
    if (serverCount) {
      data.server_count = serverCount;
      data.shard_id = shardId;
      data.shard_count = shardCount;
    } else {
      data.server_count = this.client.guilds.size;
      if (this.client.shard && this.client.shard.count) {
        data.shard_id = this.client.shard.id;
        data.shard_count = this.client.shard.count;
      } else if (this.client.shards && this.client.shards.size !== 1) {
        data.shard_count = this.client.shards.size;
      }
    }
    const response = await this._request('post', 'bots/stats', data, true);
    return response.body;
  }

  /**
   * Gets stats from a bot.
   * @param {string} id The ID of the bot you want to get the stats from.
   * @returns {Promise<Buffer>}
   */
  async getStats(id) {
    if (!id && !this.client) throw new Error('getStats requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}/stats`);
    return response.body;
  }

  /**
   * Gets information about a bot.
   * @param {string} id The ID of the bot you want to get the information from.
   * @returns {Promise<Buffer>}
   */
  async getBot(id) {
    if (!id && !this.client) throw new Error('getBot requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}`);
    return response.body;
  }

  /**
   * Gets information about a user.
   * @param {string} id The ID of the user you want to get the information from.
   * @returns {Promise<Buffer>}
   */
  async getUser(id) {
    if (!id) throw new Error('getUser requires id as argument');
    const response = await this._request('get', `users/${id}`);
    return response.body;
  }

  /**
   * Gets a list of bots matching your query.
   * @param {Object} query The query for the search.
   * @returns {Promise<Buffer>}
   */
  async getBots(query) {
    const response = await this._request('get', 'bots', query);
    return response.body;
  }

  /**
   * Gets votes from your bot.
   * @returns {Promise<Array>}
   */
  async getVotes() {
    if (!this.token) throw new Error('This function requires a token to be set');
    const response = await this._request('get', 'bots/votes', undefined, true);
    return response.body;
  }

  /**
   * Returns if a user has voted for your bot.
   * @param {string} id The ID of the user to check for.
   * @returns {Promise<boolean>}
   */
  async hasVoted(id) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (!id) throw new Error('hasVoted requires id as argument');
    const response = await this._request('get', 'bots/check', { userId: id }, true);
    return !!response.body.voted;
  }
}

module.exports = DBLAPI;
