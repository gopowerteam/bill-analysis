import z from 'zod'
import { sql, inArray, count, eq } from 'drizzle-orm'
import { sum, unique } from 'radash'
import { BatchRecordSchema, TransactionChannelEnum, TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  record: z.string(),
})

export default defineEventHandler(async (event) => {
  const { record } = await useSafeParams(event, Schema)

  const data = await db.query.BatchRecordSchema.findMany({ where: eq(BatchRecordSchema.recordId, record) })
  const batches = data.map(x => x.batchId)

  const result = await db.select({
    channel: TransactionSchema.transactionChannel,
    count: count(),
    amount: sql<number>`cast(sum(transaction.transaction_amount) as int)`,
    time: sql<string>`(SELECT to_char( transaction_time, 'YYYY-MM' ))`.as('time'),
  })
    .from(TransactionSchema)
    .groupBy(schema => [schema.time, schema.channel])
    .orderBy(schema => schema.time)
    .where(
      inArray(TransactionSchema.batchId, batches),
    )

  return unique(result.map(x => x.time)).map((time) => {
    const items = result.filter(x => x.time === time)

    return {
      time,
      amountTotal: sum(items, x => x.amount),
      amountWxPay: items.find(x => x.channel === TransactionChannelEnum.WxPay)?.amount || 0,
      amountAliPay: items.find(x => x.channel === TransactionChannelEnum.AliPay)?.amount || 0,
      countTotal: sum(items, x => x.count),
      countWxPay: items.find(x => x.channel === TransactionChannelEnum.WxPay)?.count || 0,
      countAliPay: items.find(x => x.channel === TransactionChannelEnum.AliPay)?.count || 0,
    }
  })
})
