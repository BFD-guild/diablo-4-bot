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
    this.client.on("presenceUpdate", (_, newPres) => {
      if (newPres !== null && newPres.member !== null) {
        const activities = newPres.member.presence.activities;
        if (!activities.length) {
          newPres.guild.roles.fetch().then((x) => {
            for (const item of x) {
              const role = item[1];
              if (role.name === "Active") {
                newPres.member.roles.remove(role, "Playing Diablo 4");
              }
            }
          });
        }
        for (const activity of activities) {
          if (activity.name === "Diablo IV") {
            newPres.guild.roles.fetch().then((x) => {
              for (const item of x) {
                const role = item[1];
                if (role.name === "Active") {
                  newPres.member.roles.add(role, "Playing Diablo 4");
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
