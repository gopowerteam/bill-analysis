import * as pg from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export function SchemaWithUUID<T>(columns: T) {
  return {
    id: pg.varchar('id').primaryKey().$default(() => sql`gen_random_uuid()`),
    ...columns,
  }
}
