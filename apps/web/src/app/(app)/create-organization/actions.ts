'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { CreateOrganization } from '@/http/create-organization'

const organizationSchema = z.object({
  name: z.string().min(4, {
    message: 'Please include at leats 4 characters.',
  }),
  defaultUnitName: z.string().min(4, {
    message: 'Please include at leats 4 characters.',
  }),
  defaultDepartamentName: z.string().min(4, {
    message: 'Please include at leats 4 characters.',
  }),
})

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, defaultUnitName, defaultDepartamentName } = result.data

  try {
    await CreateOrganization({
      name,
      defaultUnitName,
      defaultDepartamentName,
    })

    return {
      success: true,
      message: 'Successfully created organization!',
      errors: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.log(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }
}
