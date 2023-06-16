import { AutocompleteInteraction, Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js'

export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface SlashCommand {
  command: SlashCommandBuilder | any
  execute: (interaction: CommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    cooldowns: Collection<string, number>
  }
}
