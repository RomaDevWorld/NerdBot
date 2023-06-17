"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    command: new discord_js_1.SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping"),
    execute: (interaction) => {
        interaction.reply({ content: `Pong! ${interaction.client.ws.ping}`, ephemeral: true });
    },
    cooldown: 10,
};
exports.default = command;
