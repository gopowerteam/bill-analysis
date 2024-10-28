import { TransactionChannelEnum } from '~/drizzle/schemas'

export const TransactionChannelDict = new Map<TransactionChannelEnum | string, string>([
  [TransactionChannelEnum.WxPay, '微信'],
  [TransactionChannelEnum.AliPay, '支付宝'],
])
