import { defineConfig } from 'drizzle-kit'
import { runtimeConfig } from './runtime.config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './drizzle/schemas/index.ts',
  out: './drizzle/migrations',
  dbCredentials: runtimeConfig.database,
})
