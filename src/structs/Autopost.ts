import { Client } from "discord.js";
import { Api } from "./Api";

export class Autopost {
    private _api: Api; //topgg api
    private readonly _client: Client; //Discord.js Client
    private readonly _interval: number; //The interval for posting requests
    
    constructor (apiToken: string, botClient: Client, intervalTime?: number){
        //ApiToken is the Token you get from top.gg bot dashboard
        //botClient is a Discord.js Client
        //intervalTime is the interval time for posting status
        this._api = new Api(apiToken);
        this._client = botClient;
        if(!intervalTime){
            //intervalTime is optional. So in case someone dosen't provide it then switch to default
            //Default is 10 minutes
            intervalTime = 10*60*1000; //10 minutes in ms
        }
        this._interval = intervalTime;
    }
    public init(){
        setInterval(() => {
            if(!this._client.options.shardCount || this._client.options.shardCount <= 1){ //Not sharding on only one shard
                this._api.postStats({ //Post the status using _api
                    serverCount: this._client.guilds.cache.size //Guild count of the bot
                })
            } else {
                this._api.postStats({ //Post the status using _api
                    serverCount: this._client.guilds.cache.size, //Guild count of the bot
                    shardId: this._client.shard.ids[0], //The shard id the _client is from
                    shardCount: this._client.options.shardCount //The shard count
                })
            }
        }, this._interval); //Do this every _interval ms
    }
}



/*
Example:
import { Client } from "discord.js"
import { Autopost } from "@top-gg/sdk"

const Bot = new Client()

const Autoposter = new Autopost("TOP.GG API TOKEN", Bot, (20*60*1000))

Bot.once("ready", () => {
    Autoposter.init()
    console.log("Bot is online")
})
Bot.login("DISCORD_BOT_TOKEN")
*/
