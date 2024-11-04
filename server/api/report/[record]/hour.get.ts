import z from 'zod'
import { sql, inArray, count, eq } from 'drizzle-orm'
import { sum } from 'radash'
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
    time: sql<string>`(SELECT to_char( transaction_time, 'hh24' ))`.as('time'),
  })
    .from(TransactionSchema)
    .groupBy(schema => [schema.time, schema.channel])
    .orderBy(schema => schema.time)
    .where(
      inArray(TransactionSchema.batchId, batches),
    )

  return Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, '0')
    const item = result.filter(x => x.time === hour) || []
    return {
      time: `${hour}时`,
      amountTotal: sum(item, x => x.amount),
      amountWxPay: item.find(x => x.channel === TransactionChannelEnum.WxPay)?.amount || 0,
      amountAliPay: item.find(x => x.channel === TransactionChannelEnum.AliPay)?.amount || 0,
      countTotal: sum(item, x => x.count),
      countWxPay: item.find(x => x.channel === TransactionChannelEnum.WxPay)?.count || 0,
      countAliPay: item.find(x => x.channel === TransactionChannelEnum.AliPay)?.count || 0,
    }
  })
})
