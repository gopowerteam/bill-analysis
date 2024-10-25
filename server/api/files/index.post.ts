
import { getResolvedPDFJS } from 'unpdf'
// import z from 'zod'
import { TransactionChannelEnum } from '~/drizzle/schemas'
import { extractFromPDF } from '~/server/services/extract.service'

// const Schema = z.object({
//   channel: z.nativeEnum(TransactionChannelEnum)
// })

export default defineEventHandler(async (event) => {
  const { files } = await readBody<{ files: { content: string }[] }>(event)
  const [file] = files

  if (!file || !file.content) {
    return
  }


  const { binaryString } = parseDataUrl(file.content)
  const { getDocument } = await getResolvedPDFJS()
  const document = await getDocument(new Uint8Array(binaryString)).promise
  
  const data = await  extractFromPDF(document, TransactionChannelEnum.WxPay)
  
  console.log(data.username, data.batch, data.transactions.slice(0,10))
  
})
