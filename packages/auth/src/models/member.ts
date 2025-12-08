import { z } from 'zod'

export const memberSchema = z.object({
  __typename: z.literal('Member').default('Member'),
  id: z.string(),
  organizationId: z.string(),
  unitId: z.string().optional(),
  departamentId: z.string().optional(),
})

export type Member = z.infer<typeof memberSchema>
