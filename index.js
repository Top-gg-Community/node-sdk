const snekfetch = require('snekfetch');
const API = 'https://discordbots.org/api/';

class DBLAPI {
  /**
   * Creates a new DBLAPI Instance.
   * @param {string} token Your discordbots.org token for this bot.
   * @param {any} [client] Your Client instance, if present it will auto update your stats every 30 minutes.
   */
  constructor(token, client) {
    this.token = token;
    if (client) {
      this.client = client;
      client.on('ready', () => {
        this.postStats().catch(e => console.error(`[dblapi.js autopost] Failed to post stats: ${e.text}`)); // eslint-disable-line no-console
        setInterval(() => {
          this.postStats().catch(e => console.error(`[dblapi.js autopost] Failed to post stats: ${e.text}`)); // eslint-disable-line no-console
        }, 1800000);
      });
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
  async postStats(serverCount, shardCount) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (!serverCount && !this.client) throw new Error('postStats requires 1 argument');
    const data = {};
    if (serverCount) {
      data.server_count = serverCount;
      data.shard_count = shardCount;
    } else {
      data.server_count = this.client.guilds.size;
      if (this.client.ws.shards && this.client.ws.shards.length) {
        data.shard_count = this.client.ws.shards.length;
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
   * @param {boolean} onlyids boolean indicating if this request should only return IDs.
   * @param {number} days a number indicating how many days ago the votes should be shown.
   * @returns {Promise<Buffer>}
   */
  async getVotes(onlyids, days) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (days < 0 || days > 31) throw new Error('Days parameter out of bounds (0-31)');
    const response = await this._request('get', 'bots/votes', { onlyids, days }, true);
    return response.body;
  }

  /**
   * Returns if a user has voted for your bot.
   * @param {string} id The ID of the user to check for.
   * @param {number} days a number indicating how many days ago the vote should have been made.
   * @returns {Promise<boolean>}
   */
  async hasVoted(id, days) {
    if (!this.token) throw new Error('This function requires a token to be set');
    const voters = await this.getVotes(true, days);
    return voters.includes(id);
  }
}

module.exports = DBLAPI;
