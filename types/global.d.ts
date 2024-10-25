import type { TransactionChannelEnum } from '../drizzle/enums/transaction-channel.enum'
declare global {
  interface Bill {
    batch: string
    transactions: Transaction[]
    username: string,
    idNumber: string,
    account: string,
    channel: TransactionChannelEnum
  }
}

export { }
