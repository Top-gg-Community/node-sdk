import getBody from "raw-body";
import { Request, Response, NextFunction } from "express";
import { WebhookPayload } from "../typings";

export interface WebhookOptions {
  /**
   * Handles an error created by the function passed to Webhook.listener()
   * @default console.error
   */
  error?: (error: Error) => void | Promise<void>;
}

/**
 * Top.gg Webhook
 * @example
 * const express = require('express')
 * const { Webhook } = require(`@top-gg/sdk`)
 *
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 *
 * app.post('/dblwebhook', wh.listener(vote => {
 *   // vote is your vote object e.g
 *   console.log(vote.user) // => 321714991050784770
 * }))
 *
 * app.listen(80)
 *
 * // In this situation, your TopGG Webhook dashboard should look like
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
 */
export class Webhook {
  public options: WebhookOptions;

  /**
   * Create a new webhook client instance
   * @param authorization Webhook authorization to verify requests
   */
  constructor(private authorization?: string, options: WebhookOptions = {}) {
    this.options = {
      error: options.error ?? console.error,
    };
  }

  private _formatIncoming(
    body: WebhookPayload & { query: string }
  ): WebhookPayload {
    let out: WebhookPayload = { ...body };
    if (body?.query?.length > 0)
      out.query = Object.fromEntries(new URLSearchParams(body.query));
    return out;
  }

  private _parseRequest(
    req: Request,
    res: Response
  ): Promise<WebhookPayload | false> {
    return new Promise((resolve) => {
      if (
        this.authorization &&
        req.headers.authorization !== this.authorization
      )
        return res.status(403).json({ error: "Unauthorized" });
      // parse json

      if (req.body) return resolve(this._formatIncoming(req.body));
      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: "Malformed request" });

        try {
          const parsed = JSON.parse(body.toString("utf8"));

          resolve(this._formatIncoming(parsed));
        } catch (err) {
          res.status(400).json({ error: "Invalid body" });
          resolve(false);
        }
      });
    });
  }

  /**
   * Listening function for handling webhook requests
   * @example
   * app.post('/webhook', wh.listener((vote) => {
   *   console.log(vote.user) // => 395526710101278721
   * }))
   * @param fn Vote handling function, this function can also throw an error to allow for the webhook to resend from Top.gg
   * @example
   * // Throwing an error to resend the webhook
   * app.post('/webhook/', wh.listener((vote) => {
   *   // for example, if your bot is offline, you should probably not handle votes and try again
   *   if (bot.offline) throw new Error('Bot offline')
   * }))
   * @returns An express request handler
   */
  public listener(
    fn: (
      payload: WebhookPayload,
      req?: Request,
      res?: Response,
      next?: NextFunction
    ) => void | Promise<void>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const response = await this._parseRequest(req, res);
      if (!response) return;

      try {
        await fn(response, req, res, next);

        if (!res.headersSent) {
          res.sendStatus(204);
        }
      } catch (err) {
        this.options.error(err);

        res.sendStatus(500);
      }
    };
  }

  /**
   * (Use the new .listener() function) Middleware function to pass to express, sets req.vote to the payload
   * @deprecated
   * @example
   * app.post('/dblwebhook', wh.middleware(), (req, res) => {
   *   // req.vote is your payload e.g
   *   console.log(req.vote.user) // => 395526710101278721
   * })
   */
  public middleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const response = await this._parseRequest(req, res);
      if (!response) return;
      res.sendStatus(204);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore deprecated unsafe assignment
      req.vote = response;
      next();
    };
  }
}
