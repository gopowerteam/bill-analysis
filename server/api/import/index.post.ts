import { getResolvedPDFJS } from 'unpdf'
import z from 'zod'
import { TransactionChannelEnum } from '~/drizzle/schemas'
import { extractDataFromPDF } from '~/server/services/extract.service'
import { importDBFromData } from '~/server/services/import.service'

const Schema = z.object({
  channel: z.nativeEnum(TransactionChannelEnum),
  file: z.any(),
})

export default defineEventHandler(async (event) => {
  const { file, channel } = await useSafeBody(event, Schema)

  if (!file || !file.content) {
    return
  }

  const { binaryString } = parseDataUrl(file.content)
  const { getDocument } = await getResolvedPDFJS()
  const document = await getDocument(new Uint8Array(binaryString)).promise

  const data = await extractDataFromPDF(document, channel)
  await importDBFromData(data)

  return data.batch
})
