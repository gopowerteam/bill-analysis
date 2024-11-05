import { count, eq } from 'drizzle-orm'
import { RecordSchema, TransactionHistorySchema, TransactionSchema } from '~/drizzle/schemas'

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

  console.log('migrate transactions count:' + total)

  await db.delete(TransactionSchema)
}

export async function migrateRecords() {
  await db.update(RecordSchema).set({
    outdated: true,
  })
    .where(eq(RecordSchema.outdated, false))
}
