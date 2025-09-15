import getBody from "raw-body";
import { Request, Response, NextFunction } from "express";
import { WebhookPayload } from "../typings";

export interface WebhookOptions {
  /**
   * Handles an error created by the function passed to webhook listeners
   *
   * @see Webhook#voteListener
   * @default console.error
   */
  error?: (error: Error) => void | Promise<void>;
}

/**
 * Top.gg Webhook
 *
 * @example
 * ```js
 * const { Webhook } = require("@top-gg/sdk");
 * const express = require("express");
 * 
 * const app = express();
 * const webhook = new Webhook(process.env.MY_TOPGG_WEBHOOK_SECRET);
 * 
 * app.post("/votes", webhook.voteListener(vote => {
 *   console.log(`A user with the ID of ${vote.voterId} has voted us on Top.gg!`);
 * }));
 * 
 * app.listen(8080);
 * ```
 *
 * @link {@link https://docs.top.gg/resources/webhooks/#schema | Webhook Data Schema}
 * @link {@link https://docs.top.gg/resources/webhoooks | Webhook Documentation}
 */
export class Webhook {
  public options: WebhookOptions;

  /**
   * Create a new webhook client instance
   *
   * @param {?string} authorization Webhook authorization to verify requests
   */
  constructor(
    private authorization?: string,
    options: WebhookOptions = {}
  ) {
    this.options = {
      error: options.error ?? console.error
    };
  }

  private _formatVotePayload(body: any): WebhookPayload {
    return {
      receiverId: (body.bot ?? body.guild)!,
      voterId: body.user,
      isTest: body.type === "test",
      isWeekend: body.isWeekend,
      query: body.query ?? Object.fromEntries(new URLSearchParams(body.query))
    };
  }

  private _parseRequest(req: Request, res: Response): Promise<object | false> {
    return new Promise((resolve) => {
      if (
        this.authorization &&
        req.headers.authorization !== this.authorization
      )
        return res.status(401).json({ error: "Unauthorized" });

      // parse json
      if (req.body) return resolve(req.body);

      getBody(req, {}, (error, body) => {
        if (error) return res.status(422).json({ error: "Malformed request" });

        try {
          resolve(JSON.parse(body.toString("utf8")));
        } catch {
          res.status(400).json({ error: "Invalid body" });
          resolve(false);
        }
      });
    });
  }

  private _listener<T>(
    formatFn: (data: any) => T,
    callbackFn: (
      payload: T,
      req?: Request,
      res?: Response,
      next?: NextFunction
    ) => void | Promise<void>
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const response = await this._parseRequest(req, res);

      if (!response) return;

      try {
        await callbackFn(formatFn(response), req, res, next);

        if (!res.headersSent) {
          res.sendStatus(204);
        }
      } catch (err) {
        if (err instanceof Error) this.options.error?.(err);

        res.sendStatus(500);
      }
    };
  }

  /**
   * Listening function for handling webhook requests
   *
   * @example
   * ```js
   * app.post("/votes", webhook.voteListener(vote => {
   *   console.log(`A user with the ID of ${vote.voterId} has voted us on Top.gg!`);
   * }));
   * ```
   *
   * @example
   * ```js
   * // Throwing an error to resend the webhook
   * app.post("/votes", webhook.voteListener(vote => {
   *   // For example, if your bot is offline, you should probably not handle votes and try again.
   *   if (bot.offline) throw new Error('Bot offline');
   * }));
   * ```
   *
   * @param {(payload: WebhookPayload, req?: Request, res?: Response, next?: NextFunction) => void | Promise<void>} fn Vote handling function, this function can also throw an error to
   *   allow for the webhook to resend from Top.gg
   * @returns An express request handler
   */
  public voteListener(
    fn: (
      payload: WebhookPayload,
      req?: Request,
      res?: Response,
      next?: NextFunction
    ) => void | Promise<void>
  ) {
    return this._listener(this._formatVotePayload, fn);
  }
}
