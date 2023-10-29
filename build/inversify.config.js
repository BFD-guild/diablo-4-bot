"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const discord_js_1 = require("discord.js");
const bot_1 = require("./bot");
const types_1 = require("./types");
const container = new inversify_1.Container();
container.bind(types_1.TYPES.Bot).to(bot_1.Bot).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildPresences,
    ],
}));
container.bind(types_1.TYPES.Token).toConstantValue(process.env.TOKEN);
const stuff = "stuff";
const arr = [];
exports.default = container;
//# sourceMappingURL=inversify.config.js.map