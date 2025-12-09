'use server'

import { projectAndStepStatusSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const projectSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please, incluide at least 4 characters.' }),
    description: z.string(),
    startDate: z.string().date(),
    forecastDate: z.string().date(),
    endDate: z.string().date().optional(),
    status: projectAndStepStatusSchema.optional(),
    requestingDepartamentId: z.string(),
    managerId: z.string(),
    agentId: z.string(),
  })
  .refine(
    (data) => {
      if (data.agentId === data.managerId) {
        return false
      }
      return true
    },
    {
      message: 'Agent cannot be the same as Manager.',
      path: ['agentId'],
    },
  )

export async function createProjectAction(data: FormData) {
  console.log(Object.fromEntries(data))
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    name,
    description,
    agentId,
    forecastDate,
    managerId,
    requestingDepartamentId,
    startDate,
    endDate,
    status,
  } = result.data

  const org = await getCurrentOrg()

  try {
    await createProject({
      org: org!,
      name,
      description,
      agentId,
      forecastDate,
      managerId,
      requestingDepartamentId,
      startDate,
      endDate,
      status: status ?? 'WAITING',
    })

    revalidateTag(`${org}/projects`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the project.',
    errors: null,
  }
}
