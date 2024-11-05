import { eq } from 'drizzle-orm'
import { RecordSchema } from '~/drizzle/schemas'

export default defineEventHandler(async () => {
  return await db.query.RecordSchema.findMany({
    where: eq(RecordSchema.outdated, false),
    with: {
      user: true,
      batches: {
        with: {
          batch: true,
        },
      },
    },
  })
})
