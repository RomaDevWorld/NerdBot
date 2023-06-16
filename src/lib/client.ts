import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { SlashCommand } from '../../types'
config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()

client.login(process.env.TOKEN)

export default client
