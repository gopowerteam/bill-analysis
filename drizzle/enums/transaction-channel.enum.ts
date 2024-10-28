import { pgEnum } from 'drizzle-orm/pg-core'
import { toPgEnum } from '../utils/to-pg-enum'

export enum TransactionChannelEnum {
  AliPay = 'AliPay',
  WxPay = 'WxPay',
}

export const TransactionChannelEnumFields = pgEnum('transaction_channel_fields', toPgEnum(TransactionChannelEnum))
