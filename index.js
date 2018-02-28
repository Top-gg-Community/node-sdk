const snekfetch = require('snekfetch');
const API = 'https://discordbots.org/api/';

class DBLAPI {
  /**
   * Creates a new DBLAPI Instance.
   * @param {string} token Your Discordbots token for this bot.
   * @param {any} [client] Your Client Instance, if present it will auto update your stats every 30 minutes.
   */
  constructor(token, client) {
    this.token = token;
    if (client) {
      this.client = client;
      client.on('ready', () => {
        this.postStats();
        setInterval(() => {
          this.postStats();
        }, 1800000);
      });
    }
  }
  /**
   * Creates the request with snekfetch.
   * @param {string} method Http method to use.
   * @param {string} endpoint API Endpoint to use.
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
   * Post Stats to Discordbotlist.
   * @param {number|number[]} serverCount The Server count of your bot.
   * @param {number} [shardId] The ID of this shard.
   * @param {number} [shardCount] The Count of all Shards of your bot.
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
      if (this.client.shard) {
        data.shard_id = this.client.shard.id;
        data.shard_count = this.client.shard.count;
      }
    }
    const response = await this._request('post', 'bots/stats', data, true);
    return response.body;
  }
  /**
   * Gets Stats from a bot.
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
   * Gets Information about a bot.
   * @param {string} id The ID of the bot you want to get the Information from.
   * @returns {Promise<Buffer>}
   */
  async getBot(id) {
    if (!id && !this.client) throw new Error('getBot requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}`);
    return response.body;
  }
  /**
   * Gets Information about a User.
   * @param {string} id The ID of the User you want to get the Information from.
   * @returns {Promise<Buffer>}
   */
  async getUser(id) {
    if (!id) throw new Error('getUser requires id as argument');
    const response = await this._request('get', `users/${id}`);
    return response.body;
  }
  /**
   * Gets a list of bots matching your query.
   * @param {Object} query The Query for the search.
   * @returns {Promise<Buffer>}
   */
  async getBots(query) {
    const response = await this._request('get', 'bots', query);
    return response.body;
  }
  /**
   * Gets Votes from your bot.
   * @param {boolean} onlyids boolean indicating if this request should only return IDs.
   * @param {number} days a number indicating how much days ago the votes should be shown.
   * @returns {Promise<Buffer>}
   */
  async getVotes(onlyids, days) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (days < 0 || days > 31) throw new Error('Days parameter out of bounds (0-31)');
    const response = await this._request('get', 'bots/votes', { onlyids, days }, true);
    return response.body;
  }
  /**
   * Returns if an User has voted for your Bot.
   * @param {string} id The ID of the User to check for.
   * @returns {Promise<boolean>}
   */
  async hasVoted(id) {
    if (!this.token) throw new Error('This function requires a token to be set');
    const voters = await this.getVotes(true);
    return voters.includes(id);
  }
}

module.exports = DBLAPI;
