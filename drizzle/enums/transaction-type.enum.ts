import { pgEnum } from 'drizzle-orm/pg-core'
import { toPgEnum } from '../utils/to-pg-enum'

export enum TransactionTypeEnum {
  In = 'IN',
  Out = 'OUT',
  Other = 'OTHER',
}

export const TransactionTypeEnumFields = pgEnum('transaction_type_fields', toPgEnum(TransactionTypeEnum))
