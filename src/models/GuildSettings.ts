import { Schema, model, models } from 'mongoose'

const GuildSettings = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
})

export default models.Post || model('GuildSettings', GuildSettings)

export interface GuildSettingsI {
  guildId: string
  active: boolean
}
