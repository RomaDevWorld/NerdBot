import { Schema, model, models } from 'mongoose'

const PersonalSettings = new Schema({
  userId: {
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

export default models.Post || model('PersonalSettings', PersonalSettings)

export interface PersonalSettingsI {
  userId: string
  active: boolean
}
