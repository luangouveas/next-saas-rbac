import { z } from 'zod'

export const departamentSchema = z.object({
  __typename: z.literal('Departament').default('Departament'),
  id: z.string(),
  organizationId: z.string(),
  unitId: z.string(),
})

export type Departament = z.infer<typeof departamentSchema>
