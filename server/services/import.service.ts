import { eq } from 'drizzle-orm'
import { sum } from 'radash'
import type { TransactionChannelEnum } from '~/drizzle/schemas'
import { BatchSchema, TransactionSchema, TransactionTypeEnum, UserSchema } from '~/drizzle/schemas'

export async function importDBFromData(data: Bill) {
  await createUser(data)
  await createBatch(data)
}

function createUser(data: Bill) {
  return db.insert(UserSchema).values({
    id: data.idNumber,
    username: data.username,
  }).onConflictDoNothing({ target: UserSchema.id })
}

async function createBatch(data: Bill) {
  const target = await db.query.BatchSchema.findFirst({
    where: eq(BatchSchema.id, data.batch),
  })

  if (target) {
    return target.id
  }
  else {
    const inAmount = sum(data.transactions.filter(x => x.transactionType === TransactionTypeEnum.In), x => x.transactionAmount)
    const outAmount = sum(data.transactions.filter(x => x.transactionType === TransactionTypeEnum.Out), x => x.transactionAmount)
    const [batch] = await db.insert(BatchSchema).values({
      id: data.batch,
      account: data.account,
      channel: data.channel,
      userId: data.idNumber,
      startTime: data.startTime,
      count: data.transactions.length,
      endTime: data.endTime,
      inAmount,
      outAmount,
    })
      .returning()

    await createTransactions(batch.id, data.channel, data.transactions)
    return batch.id
  }
}

async function createTransactions(batch: string, channel: TransactionChannelEnum, transactions: BillTransaction[]) {
  return await db.insert(TransactionSchema).values(
    transactions.map(item => ({
      transactionNo: item.transactionNo,
      transactionTime: item.transactionTime,
      transactionAmount: item.transactionAmount.toString(),
      transactionType: item.transactionType,
      transactionMark: item.transactionMark,
      transactionMethod: item.transactionMethod,
      transactionChannel: channel,
      counterparty: item.counterparty,
      merchantNo: item.merchantNo,
      batchId: batch,
    })),
  )
}
