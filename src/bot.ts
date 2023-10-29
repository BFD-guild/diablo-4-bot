import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string
  ) {
    this.client = client;
    this.token = token;
  }

  public listen(): Promise<string> {
    this.client.on('presenceUpdate', (message) => {
      const activities = message.member.presence.activities;
      if(!activities.length){
        message.guild.roles.fetch('1167959194742308864').then(x => {
          message.member.roles.remove(x);
        })
      }
      for(const activity of activities){
        if(activity.name === 'Diablo IV'){
          message.guild.roles.fetch('1167959194742308864').then(x => {
            message.member.roles.add(x, 'Playing Diablo 4')
          })

        }
      }
    });
    return this.client.login(this.token);
  }
}