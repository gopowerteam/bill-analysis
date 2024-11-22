import { TransactionChannelEnum, TransactionTypeEnum } from '~/drizzle/schemas'

export const TransactionChannelDict = new Map<TransactionChannelEnum | string, string>([
  [TransactionChannelEnum.WxPay, '微信'],
  [TransactionChannelEnum.AliPay, '支付宝'],
])

export const TransactionTypeDict = new Map<TransactionChannelEnum | string, string>([
  [TransactionTypeEnum.In, '收入'],
  [TransactionTypeEnum.Out, '支出'],
  [TransactionTypeEnum.Other, '其他'],
])
