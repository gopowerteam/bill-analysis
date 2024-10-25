import { PDFDocumentProxy } from "unpdf/pdfjs";
import { Transaction, TransactionSchema, TransactionTypeEnum } from "~/drizzle/schemas";
import dayjs from 'dayjs'
export async function importFromAliPayPDF(document: PDFDocumentProxy) {
  const batchNo = await extractBatchNo(document)
  const transactions = await extractTransactions(document)
  const [username, idNumber, account] = await extractUser(document)

  console.log(username, idNumber, account,transactions)
}

async function extractBatchNo(document: PDFDocumentProxy) {
  const page = await document.getPage(1)
  const items = await parserCellItems(page)
  const content = items[0]?.s
  const result = content.match(/^编号: (\d+)$/)
  return result ? result[1] : null
}

async function extractTransactions(document: PDFDocumentProxy) {
  const rows = await extractTable(document, 7, 8)

  return rows.map(row => {
    if (row.length === 7) {
      row.splice(6, 0, {
        x1: NaN,
        y1: NaN,
        x2: NaN,
        y2: NaN,
        s: ''
      })
    }

    return {
      transactionNo: row[5].s,
      transactionTime: dayjs(row[7].s, 'YYYY-MM-DDHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      transactionMark: row[2].s,
      transactionType: parserTransactionType(row[0].s),
      transactionMethod: row[3].s,
      transactionAmount: parseFloat(row[4].s) * 100,
      counterparty: row[1].s,
      merchantNo: row[6].s,
    }
  })
    .filter(t =>  dayjs(t.transactionTime).isValid())
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

async function extractUser(document: PDFDocumentProxy) {
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

function extractAccount(text: string) {

}