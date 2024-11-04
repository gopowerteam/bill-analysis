import z from 'zod'
import { sql, inArray, count, and, desc, eq } from 'drizzle-orm'
import { sum, unique } from 'radash'
import { TransactionChannelEnum, BatchRecordSchema, TransactionSchema } from '~/drizzle/schemas'

const Schema = z.object({
  record: z.string(),
})

function formatCards(data: {
  method: string | null
  count: number
  channel: TransactionChannelEnum
  amount: number
}[]) {
  const cards: {
    cardName: string
    cardTailNumber: string
  }[] = []

  data.map(x => x.method).forEach((item) => {
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
    const items = data.filter(x => x.method?.includes(`(${card.cardTailNumber})`))

    return {
      ...card,
      channel: unique(items.map(x => x.channel)),
      amountTotal: sum(items, x => x.amount),
      amountAliPay: sum(items.filter(x => x.channel === TransactionChannelEnum.AliPay), x => x.amount),
      amountWxPay: sum(items.filter(x => x.channel === TransactionChannelEnum.WxPay), x => x.amount),
      countTotal: sum(items, x => x.count),
      countAliPay: sum(items.filter(x => x.channel === TransactionChannelEnum.AliPay), x => x.count),
      countWxPay: sum(items.filter(x => x.channel === TransactionChannelEnum.WxPay), x => x.count),
    }
  })
}

export default defineEventHandler(async (event) => {
  const { record } = await useSafeParams(event, Schema)

  const data = await db.query.BatchRecordSchema.findMany({ where: eq(BatchRecordSchema.recordId, record) })
  const batches = data.map(x => x.batchId)

  const orderByCount = db.select({
    method: TransactionSchema.transactionMethod,
    count: count(),
    channel: TransactionSchema.transactionChannel,
    amount: sql<number>`cast(sum(transaction.transaction_amount) as int)`,
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

  const orderByAmount = db.select({
    method: TransactionSchema.transactionMethod,
    count: count(),
    channel: TransactionSchema.transactionChannel,
    amount: sql<number>`cast(sum(transaction.transaction_amount) as int)`,
  })
    .from(TransactionSchema)
    .groupBy(schema => [schema.method, schema.channel])
    .orderBy(schema => desc(schema.amount))
    .where(
      and(
        inArray(TransactionSchema.batchId, batches),
        sql`${TransactionSchema.transactionMethod} SIMILAR TO '%(储蓄卡|信用卡)%'`,
      ),
    )

  const result = await Promise.all([
    orderByCount,
    orderByAmount,
  ]).then(([
    count, amount,
  ]) => ({
    orderByCount: formatCards(count),
    orderByAmount: formatCards(amount),
  }))

  return result
})
