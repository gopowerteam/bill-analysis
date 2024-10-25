import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithTime } from '../fields'
import { BatchSchema } from './batch.schema'


export const UserSchema = pgTable('user', pipe(
  SchemaWithTime,
)({
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull(),
}))

export const UserRelations = relations(UserSchema, ({ many }) => ({
  batches: many(BatchSchema),
}))


export type User = InferSchemaType<'UserSchema', { batches: true }>

export const CreateUserSchema = createInsertSchema(UserSchema)
export const SelectUserSchema = createSelectSchema(UserSchema)
