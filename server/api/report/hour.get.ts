import z from 'zod'
import { sql, inArray, count } from 'drizzle-orm'
import { sum } from 'radash'
import { TransactionChannelEnum, TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  batches: z.string().array().nonempty(),
})

export default defineEventHandler(async (event) => {
  const { batches } = await useSafeQuery(event, Schema)

  const result = await db.select({
    channel: TransactionSchema.transactionChannel,
    count: count(),
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
      time: hour,
      countTotal: sum(item, x => x.count),
      countWxPay: item.find(x => x.channel === TransactionChannelEnum.WxPay)?.count || 0,
      countAliPay: item.find(x => x.channel === TransactionChannelEnum.AliPay)?.count || 0,
    }
  })
})
