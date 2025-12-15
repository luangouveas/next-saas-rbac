'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { updateProfile } from '@/http/update-profile'

const userProfileSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please, incluide at least 4 characters.' }),
})

export async function updateProfileAction(data: FormData) {
  const result = userProfileSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: 'Validation Error', errors }
  }

  const { name } = result.data

  try {
    await updateProfile({ name })
    revalidateTag('user-profile')
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
    message: 'Successfully saved user profile.',
    errors: null,
  }
}
