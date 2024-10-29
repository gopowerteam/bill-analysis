import z from 'zod'
import { and, inArray, sql, desc, eq, not } from 'drizzle-orm'
import { TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  batches: z.string().array().nonempty(),
})

export default defineEventHandler(async (event) => {
  const { batches } = await useSafeBody(event, Schema)

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
