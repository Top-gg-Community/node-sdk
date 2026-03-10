import getBody from "raw-body";
import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import {
  IntegrationCreatePayload,
  IntegrationDeletePayload,
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
 * import { Webhook } from "@top-gg/sdk";
 * import express from "express";
 *
 * const app = express();
 * const webhook = new Webhook(process.env.TOPGG_WEBHOOK_PASSWORD);
 *
 * // POST /webhook
 * app.post("/webhook", webhook.listener((payload) => {
 *   console.log(payload);
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
      platformId: project.platform_id
    };
  }

  private _formatUser(user: any): User {
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar_url,
      platformId: user.platform_id
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
      case "integration.create": {
        data = {
          connectionId: body.data.connection_id,
          secret: body.data.webhook_secret,
          project: this._formatPartialProject(body.data.project),
          user: this._formatUser(body.data.user)
        } as IntegrationCreatePayload;

        this.authorization = data.secret;

        break;
      }

      case "integration.delete": {
        data = {
          connectionId: body.data.connection_id
        } as IntegrationDeletePayload;

        break;
      }

      case "vote.create": {
        data = {
          id: body.data.id,
          weight: body.data.weight,
          votedAt: new Date(body.data.created_at),
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
          res.status(400).json({ error: "Malformed request" });
          return resolve(false);
        }

        let signatureHeader = req.headers["x-topgg-signature"];

        if (Array.isArray(signatureHeader)) {
          signatureHeader = signatureHeader[0];
        }

        if (!signatureHeader) {
          res.status(401).json({ error: "Missing signature" });
          return resolve(false);
        }

        const parsedSignature = Object.fromEntries(
          signatureHeader.split(",").map((part) => part.split("="))
        );
        const signature = parsedSignature[API_VERSION];

        if (!parsedSignature.t || !signature) {
          res.status(422).send({ error: "Invalid signature format" });
          return resolve(false);
        }

        const hmac = crypto.createHmac("sha256", this.authorization);
        const digest = hmac
          .update(`${parsedSignature.t}.${body}`)
          .digest("hex");

        if (signature !== digest) {
          res.status(403).json({ error: "Invalid signature" });
          return resolve(false);
        }

        const bodyString = body.toString("utf8");

        try {
          const parsed = JSON.parse(bodyString);

          resolve(this._formatIncoming(parsed, req.headers["x-topgg-trace"]));
        } catch (err: any) {
          console.warn(
            `[WARNING] Unable to parse Top.gg webhook payload. Please report this bug to the SDK maintainers.\nCause: ${err.stack || err.message || err}\n--- BEGIN BODY DUMP ---\n${bodyString}\n--- END BODY DUMP ---`
          );

          res.status(204);

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
   * // POST /webhook
   * app.post("/webhook", webhook.listener((payload) => {
   *   console.log(payload);
   * }));
   * ```
   *
   * @example
   * ```js
   * // POST /webhook
   * // Throwing an error to resend the webhook
   * app.post("/webhook", webhook.listener((payload) => {
   *   // for example, if your bot is offline, you should probably not handle votes and try again
   *   if (bot.offline) {
   *     throw new Error("Bot offline");
   *   }
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
      } catch (err) {
        if (err instanceof Error) this.options.error?.(err);

        res.sendStatus(500);
      }
    };
  }
}
