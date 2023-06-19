/* eslint-disable no-unused-vars */
import { AutocompleteInteraction, ButtonBuilder, ButtonInteraction, Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js'

export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number
}

export interface Button {
  button: ButtonBuilder | any // For some reason "ButtonBuilder" does not provide "custom_id"
  execute: (interaction: ButtonInteraction) => void
}

export interface ApiResponse {
  software: {
    name: string
    version: string
    buildDate: string
    apiVersion: number
    premium: boolean
    premiumHint: string
    status: string
  }
  warnings: {
    incompleteResults: boolean
  }
  language: {
    name: string
    code: string
    confidence: number
    source: string
  }
  matches: ApiResponseMatch[] | []
  sentenceRanges: number[]
}

export interface ApiResponseMatch {
  message: string
  shortMessage: string
  replacements: string[]
  offset: number
  length: number
  context: {
    text: string
    offset: number
    length: number
  }
  sentence: string
  type: {
    typeName: string
  }
  rule: {
    id: string
    subId: string
    sourceFile: string
    description: string
    issueType: string
    category: {
      id: string
      name: string
    }
    isPremium: boolean
  }
  ignoreForIncompleteSentence: boolean
  contextForSureMatch: number
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    buttons: Collection<string, Button>
    cooldowns: Collection<string, number>
  }
}
