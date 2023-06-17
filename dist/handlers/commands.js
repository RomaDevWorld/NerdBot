"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
module.exports = (client) => {
    const slashCommands = [];
    const commandsDir = (0, path_1.join)(__dirname, '../commands');
    (0, fs_1.readdirSync)(commandsDir).forEach((file) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(`${commandsDir}/${file}`).default;
        slashCommands.push(command.command);
        client.slashCommands.set(command.command.name, command);
    });
    const rest = new rest_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    rest
        .put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
        body: slashCommands.map((command) => command.toJSON()),
    })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data) => {
        console.log(`Successfully loaded ${data.length} slash commands`);
    })
        .catch((e) => {
        console.error(e);
    });
};
