import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithTime } from '../fields'
import { RecordSchema } from './record.schema'
import { BatchSchema } from './batch.schema'

export const BatchRecordSchema = pgTable('batch_record', pipe(
  SchemaWithTime,
)({
  batchId: text('batch_id').notNull().references(() => BatchSchema.id),
  recordId: text('record_id').notNull().references(() => RecordSchema.id),
}))

export const BatchRecordRelations = relations(BatchRecordSchema, ({ one }) => ({
  batch: one(BatchSchema, {
    fields: [BatchRecordSchema.batchId],
    references: [BatchSchema.id],
  }),
  record: one(RecordSchema, {
    fields: [BatchRecordSchema.recordId],
    references: [RecordSchema.id],
  }),
}))

export type BatchRecord = InferSchemaType<'BatchRecordSchema', { batch: true, record: true }>

export const CreateBatchRecordSchema = createInsertSchema(BatchRecordSchema)
export const SelectBatchRecordSchema = createSelectSchema(BatchRecordSchema)
