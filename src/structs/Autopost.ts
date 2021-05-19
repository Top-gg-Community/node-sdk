impost { Client } from "discord.js";
import { Api } from "./Api";

export class Autopost {
    private _api: Api;
    private readonly _client: Client;
    private readonly _interval: number;
    
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
}