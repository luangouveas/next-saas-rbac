import { z } from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  organizationId: z.string(),
  requestingDepartamentId: z.string(),
  managerId: z.string(),
  ownerId: z.string(),
  status: z.enum(['IN_PROGRESS', 'STOPPED', 'COMPLETED', 'WAITING']),
})

export type Project = z.infer<typeof projectSchema>

export const projectStepSchema = z.object({
  __typename: z.literal('ProjectStep').default('ProjectStep'),
  id: z.string(),
  organizationId: z.string(),
  projectId: z.string(),
})

export type ProjectStep = z.infer<typeof projectStepSchema>
