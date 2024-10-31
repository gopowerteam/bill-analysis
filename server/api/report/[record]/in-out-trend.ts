import z from 'zod'
import { sql, inArray, and, eq } from 'drizzle-orm'
import { BatchRecordSchema, TransactionSchema, TransactionTypeEnum } from '~/drizzle/schemas'

const Schema = z.object({
  record: z.string(),
})

export default defineEventHandler(async (event) => {
  const { record } = await useSafeParams(event, Schema)

  const data = await db.query.BatchRecordSchema.findMany({ where: eq(BatchRecordSchema.recordId, record) })
  const batches = data.map(x => x.batchId)

  return await db.select({
    time: sql<string>`(SELECT to_char( transaction_time, 'YYYY-MM' ))`.as('time'),
    type: TransactionSchema.transactionType,
    amount: sql<number>`cast(sum(transaction.transaction_amount) as int)`,
  })
    .from(TransactionSchema)
    .groupBy(schema => [schema.type, schema.time])
    .orderBy(schema => schema.time)
    .where(
      and(
        inArray(TransactionSchema.batchId, batches),
        inArray(TransactionSchema.transactionType, [TransactionTypeEnum.In, TransactionTypeEnum.Out]),
      ),
    )
})
