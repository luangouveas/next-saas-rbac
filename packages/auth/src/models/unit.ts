import { z } from 'zod'

export const unitSchema = z.object({
  __typename: z.literal('Unit').default('Unit'),
  id: z.string(),
  organizationId: z.string(),
})

export type Unit = z.infer<typeof unitSchema>
