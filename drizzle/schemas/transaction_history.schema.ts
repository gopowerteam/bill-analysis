import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { pgTable } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithTime } from '../fields'
import { BatchSchema } from './batch.schema'
import { TransactionSchemaColumns } from './transaction.schema'

export const TransactionHistorySchema = pgTable('transaction_history', pipe(
  SchemaWithTime,
)(TransactionSchemaColumns))

export const TransactionHistoryRelations = relations(TransactionHistorySchema, ({ one }) => ({
  batch: one(BatchSchema, {
    fields: [TransactionHistorySchema.batchId],
    references: [BatchSchema.id],
  }),
}))

export type TransactionHistory = InferSchemaType<'TransactionHistorySchema', { batch: true }>

export const CreateTransactionHistorySchema = createInsertSchema(TransactionHistorySchema)
export const SelectTransactionHistorySchema = createSelectSchema(TransactionHistorySchema)
