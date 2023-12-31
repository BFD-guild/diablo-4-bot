"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
let Bot = class Bot {
    constructor(client, token) {
        this.client = client;
        this.token = token;
    }
    remove(newPres) {
        newPres.guild.roles.fetch().then((x) => {
            for (const item of x) {
                const role = item[1];
                if (role.name === "Active") {
                    newPres.member.roles.remove(role, "Playing Diablo 4");
                }
            }
        });
    }
    add(newPres) {
        newPres.guild.roles.fetch().then((x) => {
            for (const item of x) {
                const role = item[1];
                if (role.name === "Active") {
                    newPres.member.roles.add(role, "Playing Diablo 4");
                    let guildChannels = newPres.guild.channels;
                    let channelName = 'activity-feed';
                    let channel = guildChannels.cache.find(channel => channel.name === channelName);
                    if (channel && channel.type === discord_js_1.ChannelType.GuildText) {
                        const message = `${newPres.user.username} has started playing Diablo IV on ${new Date().toString()}`;
                        channel.send(message);
                    }
                }
            }
        });
    }
    listen() {
        this.client.on("presenceUpdate", (_, newPres) => {
            if (newPres !== null && newPres.member !== null) {
                const activities = newPres.member.presence.activities;
                if (!activities.length) {
                    this.remove(newPres);
                }
                let isPlayingDiablo = false;
                for (const activity of activities) {
                    if (activity.name === "Diablo IV") {
                        this.add(newPres);
                        isPlayingDiablo = true;
                    }
                }
                if (!isPlayingDiablo) {
                    this.remove(newPres);
                }
            }
        });
        return this.client.login(this.token);
    }
};
exports.Bot = Bot;
exports.Bot = Bot = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Client)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.Token)),
    __metadata("design:paramtypes", [discord_js_1.Client, String])
], Bot);
//# sourceMappingURL=bot.js.map