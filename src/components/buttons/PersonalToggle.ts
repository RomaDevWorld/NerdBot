import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { Button } from '../../../types'
import PersonalSettings, { PersonalSettingsI } from '../../models/PersonalSettings'
import connect from '../../lib/mongodb'

const button: Button = {
  button: new ButtonBuilder().setCustomId('personal_toggle'),
  execute: async (interaction) => {
    await connect()

    const config = await PersonalSettings.findOne<PersonalSettingsI>({ userId: interaction.user.id })

    if (!config?.active) config?.active === true

    const updatedConfig = await PersonalSettings.findOneAndUpdate<PersonalSettingsI>(
      { userId: interaction.user.id },
      {
        active: !config?.active,
      },
      { upsert: true, new: true }
    )

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('personal_toggle')
        .setLabel(updatedConfig?.active ? 'ON' : 'OFF')
        .setStyle(updatedConfig?.active ? ButtonStyle.Success : ButtonStyle.Danger)
    )

    await interaction.update({ components: [row] })
  },
}

export default button
