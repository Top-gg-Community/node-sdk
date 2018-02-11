const snekfetch = require('snekfetch');
const API = 'https://discordbots.org/api/';

class DBLAPI {
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

  _request(method, endpoint, data, auth) {
    const request = snekfetch[method](API + endpoint);
    if (method === 'post' && data) request.send(data);
    if (method === 'get' && data) request.query(data);
    if (auth) request.set({ Authorization: this.token });
    return request;
  }

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

  async getStats(id) {
    if (!id && !this.client) throw new Error('getStats requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}/stats`);
    return response.body;
  }

  async getBot(id) {
    if (!id && !this.client) throw new Error('getBot requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}`);
    return response.body;
  }

  async getUser(id) {
    if (!id) throw new Error('getUser requires id as argument');
    const response = await this._request('get', `users/${id}`);
    return response.body;
  }

  async getBots(query) {
    const response = await this._request('get', 'bots', query);
    return response.body;
  }

  async getVotes(onlyids, days) {
    if (!this.token) throw new Error('This function requires a token to be set');
    if (days < 0 || days > 31) throw new Error('Days parameter out of bounds (0-31)');
    const response = await this._request('get', 'bots/votes', { onlyids, days }, true);
    return response.body;
  }

  async hasVoted(id) {
    if (!this.token) throw new Error('This function requires a token to be set');
    const voters = await this.getVotes(true);
    return voters.includes(id);
  }
}

module.exports = DBLAPI;
