import { Client, Routes, SlashCommandBuilder } from 'discord.js'
import { REST } from '@discordjs/rest'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand } from '../../types'

import { config } from 'dotenv'
config()

module.exports = (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = []

  let commandsDir = join(__dirname, '../commands')

  readdirSync(commandsDir).forEach((file) => {
    let command: SlashCommand = require(`${commandsDir}/${file}`).default
    slashCommands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  })

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

  rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    .then((data: any) => {
      console.log(`Successfully loaded ${data.length} slash commands`)
    })
    .catch((e) => {
      console.error(e)
    })
}
