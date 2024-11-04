import { eq } from 'drizzle-orm'
import { sum } from 'radash'
import type { TransactionChannelEnum } from '~/drizzle/schemas'
import { BatchSchema, TransactionSchema, TransactionTypeEnum, UserSchema } from '~/drizzle/schemas'

export async function importDBFromData(data: Bill) {
  await db.transaction(async (tx) => {
    // 创建用户
    function createUser(data: Bill) {
      return tx.insert(UserSchema).values({
        id: data.idNumber,
        username: data.username,
      }).onConflictDoNothing({ target: UserSchema.id })
    }

    // 创建批次
    async function createBatch(data: Bill) {
      const target = await tx.query.BatchSchema.findFirst({
        where: eq(BatchSchema.id, data.batch),
      })

      if (target) {
        return target.id
      }
      else {
        const inAmount = sum(data.transactions.filter(x => x.transactionType === TransactionTypeEnum.In), x => x.transactionAmount)
        const outAmount = sum(data.transactions.filter(x => x.transactionType === TransactionTypeEnum.Out), x => x.transactionAmount)
        const [batch] = await tx.insert(BatchSchema).values({
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

        return batch.id
      }
    }

    // 创建交易
    async function createTransactions(batch: string, channel: TransactionChannelEnum, transactions: BillTransaction[]) {
      return await tx.insert(TransactionSchema).values(
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
      ).onConflictDoNothing({
        target: TransactionSchema.transactionNo,
      })
    }

    await createUser(data)
    await createBatch(data)
    await createTransactions(data.batch, data.channel, data.transactions)
  })
}
