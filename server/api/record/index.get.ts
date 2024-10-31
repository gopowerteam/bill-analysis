import { eq } from 'drizzle-orm'
import { RecordSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'

export default defineEventHandler(async (event) => {
  const { id } = await useSafeQuery(event, IdSchema)

  const record = await db.query.RecordSchema.findFirst({
    where: eq(RecordSchema.id, id),
    with: {
      user: true,
      batches: {
        with: {
          batch: true,
        },
      },
    },
  })

  return record
})
