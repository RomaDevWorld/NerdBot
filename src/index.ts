import { readdirSync } from 'fs'
import { join } from 'path'
import client from './lib/client'

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(client)
})
