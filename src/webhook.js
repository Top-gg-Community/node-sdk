const EventEmitter = require('events');
const http = require('http');
const querystring = require('querystring');

class DBLWebhook extends EventEmitter {
  /**
   * Creates a new DBLWebhook Instance.
   * @param {number} port The port to run the webhook on.
   * @param {string} [path='/dblwebhook'] The path for the webhook request.
   * @param {string} [auth] The string for Authorization you set on the site for verification.
   */
  constructor(port, path, auth) {
    super();
    this.port = port;
    this.path = path || '/dblwebhook';
    this.auth = auth;

    this._server = null;

    this._startWebhook();
  }

  _startWebhook() {
    this._server = http.createServer(this._handleRequest.bind(this));
    this._server.listen(this.port, () => {
      /**
       * Event to notify that the webhook is listening
       * @event ready
       * @param {string} hostname The hostname of the webhook server
       * @param {number} port The port the webhook server is running on
       * @param {string} path The path for the webhook
       */
      // Get the user's public IP via an API for hostname later?
      this.emit('ready', { hostname: '0.0.0.0', port: this.port, path: this.path });
    });
  }

  _handleRequest(req, res) {
    if (req.url === this.path && req.method === 'POST') {
      if (this.auth && this.auth !== req.headers.authorization) return this._returnResponse(res, 403);
      if (req.headers['content-type'] !== 'application/json') return this._returnResponse(res, 400);
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        if (data) {
          try {
            data = JSON.parse(data);
            if (data.query === '') data.query = undefined;
            if (data.query) data.query = querystring.parse(data.query.substr(1));
          } catch (e) {
            return this._returnResponse(res, 400);
          }
          /**
           * Event that fires when the webhook has received a vote.
           * @event vote
           * @param {string} bot Id of the bot that was voted for.
           * @param {string} user Id of the user that voted.
           * @param {string} type Type of the vote. Is always "upvote" except when using the test button it's "test".
           * @param {object} [query] The possible querystring parameters from the vote page.
           */
          this.emit('vote', data);
          return this._returnResponse(res, 200, 'Webhook successfully received');
        } else {
          return this._returnResponse(res, 400);
        }
      });
    } else {
      return this._returnResponse(res, 404);
    }
    return undefined;
  }

  _returnResponse(res, statusCode, data) {
    res.statusCode = statusCode;
    res.end(data);
  }
}

module.exports = DBLWebhook;
