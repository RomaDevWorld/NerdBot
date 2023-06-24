import { MessageReaction, User } from 'discord.js'
import { BotEvent } from '../../types'

const event: BotEvent = {
  name: 'messageReactionAdd',
  execute: async (reaction: MessageReaction, user: User) => {
    const referredMessage = await reaction.message.channel.messages.fetch(reaction.message.reference?.messageId as string)

    if (!referredMessage) return
    if (reaction.emoji.name !== '🤓') return
    if (user.bot) return
    if (reaction.message.author?.id !== process.env.DISCORD_CLIENT_ID?.toString()) return
    if (user.id !== referredMessage.author.id) return

    reaction.message.delete().catch((err) => console.error(err))
  },
}

export default event
