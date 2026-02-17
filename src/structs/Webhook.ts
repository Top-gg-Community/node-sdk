import getBody from "raw-body";
import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import {
  PartialProject,
  User,
  VoteCreatePayload,
  WebhookPayload,
  WebhookPayloadType,
  WebhookTestPayload
} from "../typings";
import { API_VERSION } from "./Api";

export interface WebhookOptions {
  /**
   * Handles an error created by the function passed to Webhook.listener()
   *
   * @default console.error
   */
  error?: (error: Error) => void | Promise<void>;
}

/**
 * Top.gg Webhook
 *
 * @example
 * ```js
 * const express = require("express");
 * const { Webhook } = require("@top-gg/sdk");
 *
 * const app = express();
 * const wh = new Webhook("webhookauth123");
 *
 * app.post("/dblwebhook", wh.listener((vote) => {
 *   // vote is your vote object e.g
 *   console.log(vote.user); // => 321714991050784770
 * }));
 *
 * app.listen(80);
 *
 * // In this situation, your TopGG Webhook dashboard should look like
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
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
   * @param {string} authorization Webhook authorization to verify requests
   */
  constructor(
    private authorization: string,
    options: WebhookOptions = {}
  ) {
    this.options = {
      error: options.error ?? console.error
    };
  }

  private _formatPartialProject(project: any): PartialProject {
    return {
      id: project.id,
      type: project.type,
      platform: project.platform,
      platformID: project.platform_id
    };
  }

  private _formatUser(user: any): User {
    return {
      id: user.id,
      name: user.name,
      avatarURL: user.avatar_url,
      platformID: user.platform_id
    };
  }

  private _formatIncoming(
    body: {
      type: WebhookPayloadType;
      data: any;
    },
    trace: string | string[] | undefined
  ): WebhookPayload {
    let data;

    switch (body.type) {
      case "vote.create": {
        data = {
          id: body.data.id,
          weight: body.data.weight,
          createdAt: new Date(body.data.created_at),
          expiresAt: new Date(body.data.expires_at),
          project: this._formatPartialProject(body.data.project),
          user: this._formatUser(body.data.user)
        } as VoteCreatePayload;

        break;
      }

      case "webhook.test": {
        data = {
          project: this._formatPartialProject(body.data.project),
          user: this._formatUser(body.data.user)
        } as WebhookTestPayload;
      }
    }

    return {
      type: body.type,
      data,
      trace
    };
  }

  private _parseRequest(
    req: Request,
    res: Response
  ): Promise<WebhookPayload | false> {
    return new Promise((resolve) => {
      getBody(req, {}, (error, body) => {
        if (error) {
          res.status(422).json({ error: "Malformed request" });
          return resolve(false);
        }

        let signatureHeader = req.headers["x-topgg-signature"];

        if (Array.isArray(signatureHeader)) {
          signatureHeader = signatureHeader[0];
        }

        if (!signatureHeader) {
          res.status(401).json({ error: "Missing Top.gg Signature" });
          return resolve(false);
        }

        const parsedSignature = Object.fromEntries(
          signatureHeader.split(",").map((part) => part.split("="))
        );
        const signature = parsedSignature[API_VERSION];

        if (!parsedSignature.t || !signature) {
          res.status(400).send({ error: "Invalid signature format" });
          return resolve(false);
        }

        const hmac = crypto.createHmac("sha256", this.authorization);
        const digest = hmac
          .update(`${parsedSignature.t}.${body}`)
          .digest("hex");

        if (signature !== digest) {
          res.status(401).json({ error: "Invalid Authorization" });
          return resolve(false);
        }

        try {
          const parsed = JSON.parse(body.toString("utf8"));

          resolve(this._formatIncoming(parsed, req.headers["x-topgg-trace"]));
        } catch {
          res.status(400).json({ error: "Invalid body" });
          resolve(false);
        }
      });
    });
  }

  /**
   * Listening function for handling webhook requests
   *
   * @example
   * ```js
   * app.post("/webhook", wh.listener((payload) => {
   *   if (payload.type === 'vote.create') {
   *     console.log(payload.data.user);
   *   }
   * }));
   * ```
   *
   * @example
   * ```js
   * // Throwing an error to resend the webhook
   * app.post("/webhook/", wh.listener((payload) => {
   *   // for example, if your bot is offline, you should probably not handle votes and try again
   *   if (bot.offline) throw new Error('Bot offline');
   * }));
   * ```
   *
   * @param fn Vote handling function, this function can also throw an error to
   *   allow for the webhook to resend from Top.gg
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
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const response = await this._parseRequest(req, res);
      if (!response) return;

      try {
        await fn(response, req, res, next);

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
   * Middleware function to pass to express, sets req.vote to the payload
   *
   * @deprecated Use the new {@link Webhook.listener | .listener()} function
   * @example
   * ```js
   * app.post("/dblwebhook", wh.middleware(), (req, res) => {
   *   // req.vote is your payload e.g
   *   console.log(req.vote.user); // => 395526710101278721
   * });
   * ```
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
      req.topggPayload = response;
      next();
    };
  }
}
