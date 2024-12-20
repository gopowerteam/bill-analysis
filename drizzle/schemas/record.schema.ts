import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithTime, SchemaWithUUID } from '../fields'
import { UserSchema } from './user.schema'
import { BatchRecordSchema } from './batch-record.schema'

export const RecordSchema = pgTable('record', pipe(
  SchemaWithUUID,
  SchemaWithTime,
)({
  userId: text('user_id').notNull(),
  outdated: boolean().default(false),
}))

export const RecordRelations = relations(RecordSchema, ({ one, many }) => ({
  user: one(UserSchema, {
    fields: [RecordSchema.userId],
    references: [UserSchema.id],
  }),
  batches: many(BatchRecordSchema),
}))

export type Record = InferSchemaType<'RecordSchema', {
  user: true
  batches: {
    with: {
      batch: true
    }
  }
}>

export const CreateRecordSchema = createInsertSchema(RecordSchema)
export const SelectRecordSchema = createSelectSchema(RecordSchema)
