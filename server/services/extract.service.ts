import type { PDFDocumentProxy } from 'unpdf/pdfjs'
import dayjs from 'dayjs'
import { TransactionChannelEnum, TransactionTypeEnum } from '~/drizzle/schemas'

export function extractDataFromPDF(document: PDFDocumentProxy, channel: TransactionChannelEnum): Promise<Bill> {
  switch (channel) {
    case TransactionChannelEnum.AliPay:
      return extractFromAliPay(document)
    case TransactionChannelEnum.WxPay:
      return extractFromWxPay(document)
  }
}

// Alipay Extract
export async function extractFromAliPay(document: PDFDocumentProxy) {
  const batch = await extractBatchFromAliPay(document)
  const transactions = await extractTransactionsFromAliPay(document)
  const [username, idNumber, account] = await extractUserFromAliPay(document)
  const [startTime, endTime] = await extractTimeRangeFromAliPay(document)

  return {
    batch,
    transactions,
    username,
    idNumber,
    account,
    startTime,
    endTime,
    channel: TransactionChannelEnum.AliPay,
  }
}

async function extractBatchFromAliPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[0]?.s
  const result = content.match(/^编号: (\d+)$/)
  return result ? result[1] : ''
}

async function extractUserFromAliPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[3]?.s
  // 提取姓名
  const nameMatch = content.match(/(?<=:)(.*?)(?=\()/)
  const name = nameMatch ? nameMatch[1] : ''

  // 提取证件号码
  const idNumberMatch = content.match(/(?<=证件号码:)(\d{18}|\d{17}[X|x])/)
  const idNumber = idNumberMatch ? idNumberMatch[1] : ''

  // 提取支付宝账号
  const alipayAccountMatch = content.match(/支付宝账号(.*?)中明细信息/)
  const alipayAccount = alipayAccountMatch ? alipayAccountMatch[1] : ''

  return [name, idNumber, alipayAccount]
}

async function extractTransactionsFromAliPay(document: PDFDocumentProxy) {
  const rows = await extractTable(document, 5, 8)

  const findCell = requestFindCellInRow(rows, 8)

  return rows.map((row) => {
    return {
      transactionType: parserTransactionType(findCell(row, 0)),
      counterparty: findCell(row, 1),
      transactionMark: findCell(row, 2),
      transactionMethod: findCell(row, 3),
      transactionAmount: parseFloat(findCell(row, 4)) * 100,
      transactionNo: findCell(row, 5),
      merchantNo: findCell(row, 6),
      transactionTime: dayjs(findCell(row, 7), 'YYYY-MM-DDHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
    }
  })
    .filter(t => dayjs(t.transactionTime).isValid())
}

async function extractTimeRangeFromAliPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[5]?.s
  // // 提取姓名
  const rangeMatch = content.match(/交易时间段：(.*) 至 (.*)/)
  const startTime = rangeMatch ? rangeMatch[1] : ''
  const endTime = rangeMatch ? rangeMatch[2] : ''
  return [
    startTime,
    endTime,
  ]
}

// WxPay Extract

export async function extractFromWxPay(document: PDFDocumentProxy) {
  const batch = await extractBatchFromWxPay(document)
  const transactions = await extractTransactionsFromWxPay(document)
  const [username, idNumber, account] = await extractUserFromWxPay(document)
  const [startTime, endTime] = await extractTimeRangeFromWxPay(document)

  return {
    batch,
    transactions,
    username,
    idNumber,
    account,
    startTime,
    endTime,
    channel: TransactionChannelEnum.WxPay,
  }
}

async function extractBatchFromWxPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[0]?.s
  const result = content.match(/^编号：(\d+)$/)
  return result ? result[1] : ''
}

async function extractUserFromWxPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[2]?.s
  // 提取姓名
  const nameMatch = content.match(/(?<=：)(.*?)(?=\()/)
  const name = nameMatch ? nameMatch[1] : ''

  // 提取证件号码
  const idNumberMatch = content.match(/(?<=居民身份证：)(\d{18}|\d{17}[X|x])/)
  const idNumber = idNumberMatch ? idNumberMatch[1] : ''

  // 提取微信账号
  const wxpayAccountMatch = content.match(/微信号：(.*?)中的交易/)
  const wxpayAccount = wxpayAccountMatch ? wxpayAccountMatch[1] : ''

  return [name, idNumber, wxpayAccount]
}

async function extractTransactionsFromWxPay(document: PDFDocumentProxy) {
  const rows = await extractTable(document, 5, 8)

  const findCell = requestFindCellInRow(rows, 8)

  return rows.map((row) => {
    return {
      transactionNo: findCell(row, 0),
      transactionTime: dayjs(findCell(row, 1), 'YYYY-MM-DDHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      transactionMark: findCell(row, 2),
      transactionType: parserTransactionType(findCell(row, 3)),
      transactionMethod: findCell(row, 4),
      transactionAmount: parseFloat(findCell(row, 5)) * 100,
      counterparty: findCell(row, 6),
      merchantNo: findCell(row, 7),
    }
  })
    .filter(t => dayjs(t.transactionTime).isValid())
}

async function extractTimeRangeFromWxPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[5]?.s
  // // 提取姓名
  const rangeMatch = content.match(/(.*)至(.*)/)
  const startTime = rangeMatch ? rangeMatch[1] : ''
  const endTime = rangeMatch ? rangeMatch[2] : ''

  return [
    startTime,
    endTime,
  ]
}

function requestFindCellInRow(rows: CellItem[][], size: number) {
  const columns = Array.from(Array(size), () => ({
    x1: NaN,
    x2: NaN,
  }))

  const data = rows.filter(x => x.length === size)

  data.forEach((row) => {
    for (let i = 0; i < size; i++) {
      if (isNaN(columns[i].x1) || columns[i].x1 > row[i].x1) {
        columns[i].x1 = row[i].x1
      }
      if (isNaN(columns[i].x2) || columns[i].x2 < row[i].x2) {
        columns[i].x2 = row[i].x2
      }
    }
  })

  return (row: CellItem[], index: number) => {
    const { x1, x2 } = columns[index]
    const cell = row.find(cell => cell.x1 >= x1 && cell.x2 <= x2)
    return cell?.s || ''
  }
}

function parserTransactionType(value: string) {
  switch (value) {
    case '收入':
      return TransactionTypeEnum.In
    case '支出':
      return TransactionTypeEnum.Out
    default:
      return TransactionTypeEnum.Other
  }
}
