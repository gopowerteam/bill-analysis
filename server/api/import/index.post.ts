import { getResolvedPDFJS } from 'unpdf'
import z from 'zod'
import { omit } from 'radash'
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
    throw createError({
      statusCode: 400,
      statusMessage: '未发现待导入账单',
    })
  }

  const { binaryString } = parseDataUrl(file.content)
  const { getDocument } = await getResolvedPDFJS()
  const document = await getDocument(new Uint8Array(binaryString)).promise

  const data = await extractDataFromPDF(document, channel)
  if (data.username && data.account && data.batch && data.idNumber) {
    await importDBFromData(data)
  }
  else {
    throw createError({
      statusCode: 400,
      statusMessage: '导入账单格式错误',
    })
  }

  return omit(data, ['transactions'])
})
