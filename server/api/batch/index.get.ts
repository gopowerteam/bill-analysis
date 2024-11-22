import { eq } from 'drizzle-orm'
import { RecordSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'

export default defineEventHandler(async (event) => {
  const { id } = await useSafeQuery(event, IdSchema)

  const batch = await db.query.BatchSchema.findFirst({
    where: eq(RecordSchema.id, id),
    with: {
      user: true,
      transactions: true,
    },
  })

  return batch
})
