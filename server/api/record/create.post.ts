import z from 'zod'
import { inArray } from 'drizzle-orm'
import { BatchSchema, RecordSchema } from '~/drizzle/schemas'
import { BatchRecordSchema } from '~/drizzle/schemas/batch-record.schema'

const Schema = z.object({
  batches: z.string().array().nonempty(),
})

export default defineEventHandler(async (event) => {
  const { batches } = await useSafeBody(event, Schema)

  const batch = await db.query.BatchSchema.findFirst({ where:
    inArray(BatchSchema.id, batches),
  })

  const [record] = await db.insert(RecordSchema).values({
    userId: batch!.userId,
  }).returning()

  await db.insert(BatchRecordSchema).values(batches.map(batch => ({
    batchId: batch,
    recordId: record.id,
  })))

  return record
})
