import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '~/drizzle/schemas'

const runtimeConfig = useRuntimeConfig()

const client = new pg.Client(runtimeConfig.database)
await client.connect()

export const db = drizzle(client, { schema })
