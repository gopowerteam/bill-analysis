import z from 'zod'
import { sql, inArray, count, and, desc } from 'drizzle-orm'
import { sum, unique } from 'radash'
import { TransactionChannelEnum, TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  batches: z.string().array().nonempty(),
})

export default defineEventHandler(async (event) => {
  const { batches } = await useSafeQuery(event, Schema)

  const result = await db.select({
    method: TransactionSchema.transactionMethod,
    count: count(),
    channel: TransactionSchema.transactionChannel,
  })
    .from(TransactionSchema)
    .groupBy(schema => [schema.method, schema.channel])
    .orderBy(schema => desc(schema.count))
    .where(
      and(
        inArray(TransactionSchema.batchId, batches),
        sql`${TransactionSchema.transactionMethod} SIMILAR TO '%(储蓄卡|信用卡)%'`,
      ),
    )

  const cards: {
    cardName: string
    cardTailNumber: string
  }[] = []

  result.map(x => x.method).forEach((item) => {
    item?.split('&').forEach((x) => {
      const matches = x.match(/(.*?)\((\d+)\)/)
      if (matches?.length === 3) {
        const cardName = matches[1]
        const cardTailNumber = matches[2]

        if (cards.every(x => x.cardName !== cardName && x.cardTailNumber !== cardTailNumber)) {
          cards.push({ cardName, cardTailNumber })
        }
      }
    })
  })

  return cards.map((card) => {
    const items = result.filter(x => x.method?.includes(`(${card.cardTailNumber})`))

    return {
      ...card,
      channel: unique(items.map(x => x.channel)),
      countTotal: sum(items, x => x.count),
      countAliPay: sum(items.filter(x => x.channel === TransactionChannelEnum.AliPay), x => x.count),
      countWxPay: sum(items.filter(x => x.channel === TransactionChannelEnum.WxPay), x => x.count),
    }
  })
})
