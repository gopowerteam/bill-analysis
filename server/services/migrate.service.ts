import { count } from 'drizzle-orm'
import { TransactionHistorySchema, TransactionSchema } from '~/drizzle/schemas'

const pageSize = 5000

export async function migrateTransaction() {
  const [result] = await db.select({ count: count() }).from(TransactionSchema)
  const pageTotal = Math.ceil(result.count / pageSize)
  let total = 0

  for (let pageIndex = 0; pageIndex < pageTotal; pageIndex++) {
    const transactions = await db.query.TransactionSchema.findMany({
      limit: pageSize,
      offset: pageIndex * pageSize,
      orderBy: TransactionSchema.createdAt,
    })

    total += transactions.length

    await db.insert(TransactionHistorySchema)
      .values(transactions)
      .onConflictDoNothing({
        target: TransactionHistorySchema.transactionNo,
      })
  }

  console.log(total)

  await db.delete(TransactionSchema)
}
