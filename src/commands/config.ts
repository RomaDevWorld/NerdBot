import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import PersonalToggle from '../components/buttons/PersonalToggle'
import connect from '../lib/mongodb'
import PersonalSettings, { PersonalSettingsI } from '../models/PersonalSettings'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder().setName('config').setDescription('Shows config panel'),
  execute: async (interaction) => {
    await connect()
    const button = new ButtonBuilder(PersonalToggle.button.data)

    const config = await PersonalSettings.findOne<PersonalSettingsI>({ userId: interaction.user.id })

    config && config.active ? button.setStyle(ButtonStyle.Success) : button.setStyle(ButtonStyle.Danger)
    config && config.active ? button.setLabel('ON') : button.setLabel('OFF')

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
    await interaction.reply({ content: 'Toggle bot ON or OFF', components: [row], ephemeral: true })
  },
  cooldown: 10,
}

export default ClearCommand
