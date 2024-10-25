import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { timestamp, pgTable, text, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { BatchSchema } from './batch.schema'
import { TransactionTypeEnumFields } from '../enums/transaction-type.enum'
import { TransactionChannelEnumFields } from '../enums/transaction-channel.enum'


export const TransactionSchema = pgTable('transaction', pipe(
  SchemaWithTime
)({
  transactionNo: text('transaction_no').primaryKey().notNull(),
  transactionTime: timestamp('transaction_time',{ withTimezone: true, mode: 'string' }).notNull(),
  transactionMark: text('transaction_mark').notNull(),
  transactionType: TransactionTypeEnumFields('transaction_type').notNull(),
  transactionChannel: TransactionChannelEnumFields('transaction_channel').notNull(),
  transactionMethod: text('transaction_method').notNull(),
  transactionAmount: decimal('transaction_amount',{ scale:0 }).notNull(),
  counterparty: text('counterparty').notNull(),
  merchantNo: text('merchant_no').notNull(),
  batchId: text('batch_id').notNull(),
}))

export const TransactionRelations = relations(TransactionSchema, ({ one }) => ({
  batch: one(BatchSchema, {
    fields: [TransactionSchema.batchId],
    references: [BatchSchema.id],
  }),
}));


export type Transaction = InferSchemaType<'TransactionSchema', { batch: true }>

export const CreateTransactionSchema = createInsertSchema(TransactionSchema)
export const SelectTransactionSchema = createSelectSchema(TransactionSchema)
