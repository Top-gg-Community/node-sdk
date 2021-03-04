<a name="Change Log"></a>

# Change Log

## 3.0.9
  - A change to how typings are used, properly exports via dist/typings

## 3.0.8
  - Change docs URL
  - Fix typos in a few method docs
  - Specified that .hasVoted() is last 12 hours
  - Auto-respond with status 200 as per docs

## 3.0.7
  - Add new BotInfo.bannerUrl to typings

## 3.0.6
  - Fix to webhook, where there were issues when using a body parser that also used `raw-body`

## 3.0.5
  - Fix to Api.isWeekend example

## 3.0.4
  - Released official documentation page
  - Added GitHub actions to publish to npm on release

## 3.0.3
  - Fixed some webhook bugs
  - Improved a few typings

## 3.0.2
Some day-one patches to README, 3.0.1 is a dud release

## 3.0.0
A full rewrite of the package, here's some of the major changes:
  - The webhook and API interaction have been full separated, into two different classes, `Api` and `Webhook`
  - Auto-Posting is no longer natively supported in the package, instead you can use the officially *supported* [`topgg-autoposter`](https://npmjs.com/topgg-autoposter) package.
  - The webhook class is no longer ran off of events, instead acting as a middleware function that defines `req.vote`
