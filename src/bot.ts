import { Client, Message } from "discord.js";
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

  public listen(): Promise<string> {
    this.client.on("presenceUpdate", (message) => {
      if (message !== null && message.member !== null) {
        const activities = message.member.presence.activities;
        if (!activities.length) {
          message.guild.roles.fetch().then((x) => {
            for (const item of x) {
              const role = item[1];
              if (role.name === "Active") {
                message.member.roles.remove(role, "Playing Diablo 4");
              }
            }
          });
        }
        for (const activity of activities) {
          if (activity.name === "Diablo IV") {
            message.guild.roles.fetch().then((x) => {
              for (const item of x) {
                const role = item[1];
                if (role.name === "Active") {
                  message.member.roles.add(role, "Playing Diablo 4");
                }
              }
            });
          }
        }
      }
    });
    return this.client.login(this.token);
  }
}
