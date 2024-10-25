import process from 'node:process'
import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as seeds from '../seeds'
import { runtimeConfig } from '../../runtime.config'

async function createDB() {
  const client = new pg.Client(runtimeConfig.database)
  await client.connect()

  return drizzle(client)
}

async function seed() {
  const db = await createDB()

  await db.transaction(async (tx) => {
    await Promise.all(
      Object.values(seeds).map(run => {
        if (run && typeof run === 'function') {
          run(tx)
        }
      }),
    )
  })
}

seed().then(() => {
  process.exit(1)
}).catch((e) => {
  console.error(e)
})
