import { z } from 'h3-zod'

export const IdSchema = z.object({
  id: z.string(),
})
