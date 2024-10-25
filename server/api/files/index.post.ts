
import { getResolvedPDFJS,configureUnPDF } from 'unpdf'
import z from 'zod'
import { TransactionChannelEnum } from '~/drizzle/schemas'
import { importFromAliPayPDF } from '~/server/services/wxpay.service'
import { extractTable } from '~/server/utils/pdf-parser'

const Schema = z.object({
  channel: z.nativeEnum(TransactionChannelEnum)
})

export default defineEventHandler(async (event) => {
  const { files } = await readBody<{ files: { content: string }[] }>(event)
  const [file] = files

  if (!file || !file.content) {
    return
  }


  const { binaryString } = parseDataUrl(file.content)
  const { getDocument } = await getResolvedPDFJS()
  const document = await getDocument(new Uint8Array(binaryString)).promise
  
  importFromAliPayPDF(document)
  
})
