import { Client, Routes, SlashCommandBuilder } from 'discord.js'
import { REST } from '@discordjs/rest'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand } from '../../types'

import { config } from 'dotenv'
config()

module.exports = (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = []

  const commandsDir = join(__dirname, '../commands')

  readdirSync(commandsDir).forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: SlashCommand = require(`${commandsDir}/${file}`).default
    slashCommands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  })

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string)

  rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      console.log(`Successfully loaded ${data.length} slash commands`)
    })
    .catch((e) => {
      console.error(e)
    })
}
