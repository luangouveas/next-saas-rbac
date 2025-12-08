import { z } from 'zod'

import { roleSchema } from '../roles'

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
  organizationId: z.string(),
  unitId: z.string(),
  departamentId: z.string(),
})

export type User = z.infer<typeof userSchema>
