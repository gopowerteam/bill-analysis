import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '~/drizzle/schemas'

const { database } = useRuntimeConfig()

const DATABASE_URL = `postgresql://${database.user}:${database.password}@${database.host}:${database.port}/${database.database}`
export const db = drizzle(DATABASE_URL, {
  schema,
})
