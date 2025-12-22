'use server'

import { projectAndStepStatusSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProjectStep } from '@/http/create-projectStep'

const projectStepSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please, incluide at least 4 characters.' }),
  description: z.string().nullable(),
  startDate: z.string().refine((v) => v !== '' && v !== undefined, {
    path: ['startDate'],
    message: 'Invalid date',
  }),
  forecastDate: z.string().refine((v) => v !== '' && v !== undefined, {
    path: ['forecastDate'],
    message: 'Invalid date',
  }),
  endDate: z.string().nullish(),
  status: projectAndStepStatusSchema,
  userId: z.string(),
})

const createProjectStepSchema = projectStepSchema.merge(
  z.object({
    projectSlug: z.string(),
  }),
)

const updateProjectStepSchema = projectStepSchema.merge(
  z.object({
    id: z.string(),
  }),
)

export type CreateProjectStepSchema = z.infer<typeof createProjectStepSchema>
export type UpdateProjectStepSchema = z.infer<typeof updateProjectStepSchema>

export async function createProjectSetpAction(data: FormData) {
  const result = createProjectStepSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const org = await getCurrentOrg()

  try {
    await createProjectStep({ org: org!, data: result.data })

    revalidateTag(`${org}/project/${result.data.projectSlug}/steps`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the project step.',
    errors: null,
  }
}
