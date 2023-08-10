import { Message } from 'discord.js'
import { ApiResponse, ApiResponseMatch, BotEvent } from '../../types'
import axios from 'axios'
import connect from '../lib/mongodb'
import PersonalSettings, { PersonalSettingsI } from '../models/PersonalSettings'

const cooldown = new Set()

const ignoredRules = ['UPPERCASE_SENTENCE_START', 'UK_SIMPLE_REPLACE']

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (message.author.bot || cooldown.has(message.author.id)) return

    await connect()
    const config = await PersonalSettings.findOne<PersonalSettingsI>({ userId: message.author.id })
    if (config?.active === false) return

    const content = message.content.replace(/<[^>]+>/g, '')
    if (!content || content === '?') return

    const response = await axios
      .post<ApiResponse>(
        'https://api.languagetoolplus.com/v2/check',
        {
          text: content,
          language: 'auto',
          enabledOnly: 'false',
          preferredVariants: config?.preferred.join(',') || 'en-US',
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' } }
      )
      .catch((error) => {
        console.error(error)
        return
      })
    if (!response) return
    const matches = response.data.matches.filter((match: ApiResponseMatch) => !ignoredRules.includes(match.rule.id))

    cooldown.add(message.author.id)
    setTimeout(() => {
      cooldown.delete(message.author.id)
    }, 15000)

    if (config && !config?.preferred.includes(response.data.language.code as never)) return
    if (response.data.language.code === 'ru-RU') return
    if (!matches[0]) return

    const thread = await message.startThread({
      name: content.slice(0, 100),
    })

    thread
      .send(
        matches.length === 1
          ? `🤓☝️ ${matches[0].message}`
          : `🤓☝️\n${matches.map((match: ApiResponseMatch, index: number) => `${index + 1}. ${match.message}`).join('\n')}`
      )
      .catch((error) => console.error(error))

    setTimeout(() => {
      thread.setArchived(true).catch((err) => console.error(err))
    }, 30000)
  },
}

export default event
