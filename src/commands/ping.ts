import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { SlashCommand } from '../../types'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping"),
  execute: (interaction) => {
    interaction.reply({ content: `Pong! ${interaction.client.ws.ping}`, ephemeral: true })
  },
  cooldown: 10,
}

export default command
