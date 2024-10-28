import type { TransactionChannelEnum } from '../drizzle/enums/transaction-channel.enum'

declare global {
  interface Bill {
    batch: string
    transactions: BillTransaction[]
    username: string
    idNumber: string
    account: string
    startTime: string
    endTime: string
    channel: TransactionChannelEnum
  }

  interface BillTransaction {
    transactionType: TransactionTypeEnum
    counterparty: string
    transactionMark: string
    transactionMethod: string
    transactionAmount: number
    transactionNo: string
    merchantNo: string
    transactionTime: string
  }
}

export { }
