import z from 'zod'
import { and, inArray, sql, desc, eq, not } from 'drizzle-orm'
import { BatchRecordSchema, TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  record: z.string(),
})

export default defineEventHandler(async (event) => {
  const { record } = await useSafeParams(event, Schema)

  const data = await db.query.BatchRecordSchema.findMany({ where: eq(BatchRecordSchema.recordId, record) })
  const batches = data.map(x => x.batchId)

  const result = await db.select({
    counterparty: TransactionSchema.counterparty,
    count: sql<number>`cast(count(*) as int)`,
    amount: sql<number>`cast(sum(transaction.transaction_amount) as int)`,
  })
    .from(TransactionSchema)
    .limit(5)
    .groupBy(TransactionSchema.counterparty)
    .orderBy(schema => desc(schema.count))
    .where(
      and(
        inArray(TransactionSchema.batchId, batches),
        not(
          eq(TransactionSchema.counterparty, ''),

        ),
        not(
          eq(TransactionSchema.counterparty, '/'),

        ),
      ),
    )

  return result
})
