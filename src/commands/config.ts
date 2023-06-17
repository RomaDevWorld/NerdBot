import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import Hello from '../components/buttons/Hello'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('config').setDescription('Configure bot behavior'),
  execute: (interaction) => {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(Hello.button)
    interaction.reply({
      content: `Hello`,
      components: [row],
      ephemeral: true,
    })
  },
  cooldown: 10,
}

export default command
