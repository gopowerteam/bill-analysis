import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithTime } from '../fields'
import { TransactionChannelEnumFields } from '../enums/transaction-channel.enum'
import { UserSchema } from './user.schema'
import { TransactionSchema } from './transaction.schema'


export const BatchSchema = pgTable('batch', pipe(
  SchemaWithTime,
)({
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  channel: TransactionChannelEnumFields('channel').notNull(),
  account: text("account").notNull(),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'string' }),
  endTime: timestamp('end_time', { withTimezone: true, mode: 'string' })
}))

export const BatchRelations = relations(BatchSchema, ({ one,many }) => ({
  user: one(UserSchema, {
    fields: [BatchSchema.userId],
    references: [UserSchema.id],
  }),
  transactions: many(TransactionSchema)
}));


export type Batch = InferSchemaType<'BatchSchema', { user: true }>

export const CreateBatchSchema = createInsertSchema(BatchSchema)
export const SelectBatchSchema = createSelectSchema(BatchSchema)
