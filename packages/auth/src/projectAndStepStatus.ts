import { z } from 'zod'

export const projectAndStepStatusSchema = z.union([
  z.literal('IN_PROGRESS'),
  z.literal('STOPPED'),
  z.literal('COMPLETED'),
  z.literal('WAITING'),
])

export type ProjectAndStepStatus = z.infer<typeof projectAndStepStatusSchema>
