import { BaseChannel, ChannelType, Client, Message, Presence } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";

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

  private remove(newPres: Presence){
    newPres.guild.roles.fetch().then((x) => {
      for (const item of x) {
        const role = item[1];
        if (role.name === "Active") {
          newPres.member.roles.remove(role, "Playing Diablo 4");
        }
      }
    });
  }

  private add(newPres: Presence){
    newPres.guild.roles.fetch().then((x) => {
      for (const item of x) {
        const role = item[1];
        if (role.name === "Active") {
          newPres.member.roles.add(role, "Playing Diablo 4");
          let guildChannels = newPres.guild.channels;
          let channelName = 'activity-feed';
          let channel = guildChannels.cache.find(channel => channel.name === channelName);
          if (channel && channel.type === ChannelType.GuildText) {
            const message = `${newPres.user.username} has started playing Diablo IV on ${new Date().toString()}`
              channel.send(message);
          }
        }
      }
    });
  }

  public listen(): Promise<string> {
    this.client.on("presenceUpdate", (_, newPres) => {
      if (newPres !== null && newPres.member !== null) {
        const activities = newPres.member.presence.activities;
        if (!activities.length) {
          this.remove(newPres)
        }
        let isPlayingDiablo = false;
        for (const activity of activities) {
          if (activity.name === "Diablo IV") {
            this.add(newPres)
            isPlayingDiablo = true;
          }
        }
        if(!isPlayingDiablo){
          this.remove(newPres)
        }
      }
    });
    return this.client.login(this.token);
  }
}
