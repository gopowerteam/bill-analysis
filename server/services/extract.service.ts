import { PDFDocumentProxy } from "unpdf/pdfjs";
import { TransactionChannelEnum, TransactionTypeEnum } from "~/drizzle/schemas";
import dayjs from 'dayjs'

export function extractFromPDF(document: PDFDocumentProxy, channel: TransactionChannelEnum) {
  switch (channel) {
    case TransactionChannelEnum.Alipay:
      return extractFromAlipay(document)
    case TransactionChannelEnum.WxPay:
      return extractFromWxPay(document)
  }
}

// Alipay Extract
export async function extractFromAlipay(document: PDFDocumentProxy) {
  const batch = await extractBatchFromAliPay(document)
  const transactions = await extractTransactionsFromAliPay(document)
  const [username, idNumber, account] = await extractUserFromAliPay(document)

  return {
    batch,
    transactions,
    username,
    idNumber,
    account,
    channel: TransactionChannelEnum.WxPay
  }
}

async function extractBatchFromAliPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[0]?.s
  const result = content.match(/^编号: (\d+)$/)
  return result ? result[1] : null
}

async function extractUserFromAliPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[3]?.s
  // 提取姓名
  const nameMatch = content.match(/(?<=:)(.*?)(?=\()/);
  const name = nameMatch ? nameMatch[1] : null;

  // 提取证件号码
  const idNumberMatch = content.match(/(?<=证件号码:)(\d{18})/);
  const idNumber = idNumberMatch ? idNumberMatch[1] : null;

  // 提取支付宝账号
  const alipayAccountMatch = content.match(/支付宝账号(\S+@[\S.]+)中/);
  const alipayAccount = alipayAccountMatch ? alipayAccountMatch[1] : null;

  return [name, idNumber, alipayAccount]
}

async function extractTransactionsFromAliPay(document: PDFDocumentProxy) {
  const rows = await extractTable(document, 5, 8)

  const findCell = requestFindCellInRow(rows, 8)

  return rows.map(row => {

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

// WxPay Extract


export async function extractFromWxPay(document: PDFDocumentProxy) {
  const batch = await extractBatchFromWxPay(document)
  const transactions = await extractTransactionsFromWxPay(document)
  const [username, idNumber, account] = await extractUserFromWxPay(document)

  return {
    batch,
    transactions,
    username,
    idNumber,
    account,
    channel: TransactionChannelEnum.WxPay
  }
}

async function extractBatchFromWxPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[0]?.s
  const result = content.match(/^编号：(\d+)$/)
  return result ? result[1] : null
}

async function extractUserFromWxPay(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[2]?.s
  // 提取姓名
  const nameMatch = content.match(/(?<=：)(.*?)(?=\()/);
  const name = nameMatch ? nameMatch[1] : null;

  // 提取证件号码
  const idNumberMatch = content.match(/(?<=居民身份证：)(\d{18})/);
  const idNumber = idNumberMatch ? idNumberMatch[1] : null;

  // 提取支付宝账号
  const alipayAccountMatch = content.match(/微信号：(\S+@[\S.]+)中/);
  const alipayAccount = alipayAccountMatch ? alipayAccountMatch[1] : null;

  return [name, idNumber, alipayAccount]
}

async function extractTransactionsFromWxPay(document: PDFDocumentProxy) {
  const rows = await extractTable(document, 5, 8)

  const findCell = requestFindCellInRow(rows, 8)

  return rows.map(row => {

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

function requestFindCellInRow(rows: CellItem[][], size: number) {
  const columns = Array.from(Array(size), () => ({
    x1: NaN,
    x2: NaN
  }))

  const data = rows.filter(x => x.length === size)


  data.forEach(row => {
    for (let i = 0; i < size; i++) {
      if (isNaN(columns[i].x1) || columns[i].x1 > row[i].x1) {
        columns[i].x1 = row[i].x1
      }
      if (isNaN(columns[i].x2) || columns[i].x2 < row[i].x2) {
        columns[i].x2 = row[i].x2
      }
    }
  })

  console.log(columns)

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

