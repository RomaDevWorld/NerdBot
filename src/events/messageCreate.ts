import { Message } from 'discord.js'
import { ApiResponse, ApiResponseMatch, BotEvent } from '../../types'
import axios from 'axios'

const cooldown = new Set()

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (message.author.bot || !message.content) return

    const ignoredRules = ['UPPERCASE_SENTENCE_START', 'UK_SIMPLE_REPLACE']

    if (cooldown.has(message.author.id)) return

    const response = await axios
      .post<ApiResponse>(
        'https://api.languagetoolplus.com/v2/check',
        {
          text: message.content,
          language: 'auto',
          enabledOnly: 'false',
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

    if (response.data.language.code === 'ru-RU') return
    if (!matches[0]) return

    message
      .reply(matches.length === 1 ? `🤓☝️ ${matches[0].message}` : `🤓☝️\n${matches.map((match: ApiResponseMatch, index: number) => `${index + 1}. ${match.message}`).join('\n')}`)
      .then((msg) => {
        msg.react('🤓').catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
  },
}

export default event
