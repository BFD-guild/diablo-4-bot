import "reflect-metadata";
import { Container } from "inversify";
import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./bot";
import { TYPES } from "./types";
const container = new Container();
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences,
    ],
  })
);
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
export default container;
