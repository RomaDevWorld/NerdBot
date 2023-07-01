import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { ApiResponse, SlashCommand } from '../../types'
import PersonalToggle from '../components/buttons/PersonalToggle'
import connect from '../lib/mongodb'
import PersonalSettings, { PersonalSettingsI } from '../models/PersonalSettings'
import axios from 'axios'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('config')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('preferred')
        .setDescription('Preferred languages')
        .addStringOption((option) => option.setName('preferred').setDescription('Preferred languages').setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName('toggle').setDescription('Toggle bot on or off'))
    .setDescription('Shows config panel'),
  execute: async (interaction) => {
    await connect()
    const button = new ButtonBuilder(PersonalToggle.button.data)

    const subcommand = interaction.options.getSubcommand()

    const config = await PersonalSettings.findOne<PersonalSettingsI>({ userId: interaction.user.id })

    switch (subcommand) {
      case 'toggle': {
        config && config.active ? button.setStyle(ButtonStyle.Success) : button.setStyle(ButtonStyle.Danger)
        config && config.active ? button.setLabel('ON') : button.setLabel('OFF')

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
        await interaction.reply({ content: 'Toggle bot ON or OFF', components: [row], ephemeral: true })
        break
      }
      case 'preferred': {
        const languages = interaction.options.getString('preferred')?.split(' ')

        const response = await axios
          .post<ApiResponse>(
            'https://api.languagetoolplus.com/v2/check',
            {
              text: 'Hello',
              language: 'auto',
              enabledOnly: 'false',
              preferredVariants: languages?.join(','),
            },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' } }
          )
          .catch((error) => {
            console.error(error)
            return
          })

        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Error!' })
          .setColor('Red')
          .setDescription(
            'Something went wrong while sending the test request.\nPlease check if you specified languages correctly (Separate them with spaces)'
          )
          .addFields({
            name: 'List of supported languages',
            value:
              '`ar`, `ast-ES`, `be-BY`, `br-FR`, `ca-ES`, `ca-ES-balear`, `ca-ES-valencia`, `da-DK`, `de`, `de`, `de-AT`, `de-AT`, `de-CH`, `de-CH`, `de-DE`, `de-DE`, `de-DE-x-simple-language`, `de-DE-x-simple-language-DE`, `de-LU`, `el-GR`, `en`, `en`, `en-AU`, `en-AU`, `en-CA`, `en-CA`, `en-GB`, `en-GB`, `en-NZ`, `en-NZ`, `en-US`, `en-US`, `en-ZA`, `en-ZA`, `eo`, `es`, `es`, `es-AR`, `es-ES`, `fa`, `fa-IR`, `fr`, `fr`, `fr-FR`, `ga-IE`, `gl-ES`, `it`, `it-IT`, `ja-JP`, `km-KH`, `nb`, `nl`, `nl`, `nl-BE`, `nl-NL`, `no`, `pl-PL`, `pt`, `pt-AO`, `pt-AO`, `pt-BR`, `pt-BR`, `pt-MZ`, `pt-MZ`, `pt-PT`, `pt-PT`, `ro-RO`, `sk-SK`, `sl-SI`, `sv`, `sv-SE`, `ta-IN`, `tl-PH`, `uk-UA`, `zh-CN`',
          })

        if (!response) return await interaction.reply({ embeds: [embed], ephemeral: true })

        const updated = await PersonalSettings.findOneAndUpdate<PersonalSettingsI>(
          { userId: interaction.user.id },
          {
            preferred: languages,
          },
          { new: true }
        )

        await interaction.reply({ content: `Your preferred languages:\n${updated?.preferred.map((i) => `\`${i}\``).join(' ')}`, ephemeral: true })

        break
      }
    }
  },
  cooldown: 15,
}

export default ClearCommand
