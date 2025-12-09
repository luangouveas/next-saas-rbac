'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createUnit } from '@/http/create-unit'
import { updateUnit } from '@/http/update-unit'

const unitSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(4, { message: 'Please, incluide at least 4 characters.' }),
})

export type UnitSchema = z.infer<typeof unitSchema>

export async function createUnitAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = unitSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: 'Validation Error', errors }
  }

  const { name } = result.data

  try {
    await createUnit({
      org: currentOrg!,
      name,
    })

    revalidateTag(`${currentOrg}/units`)
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
    message: 'Successfully saved the unit.',
    errors: null,
  }
}

export async function updateUnitAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = unitSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: 'Validation Error', errors }
  }

  const { name, id } = result.data

  try {
    await updateUnit({
      org: currentOrg!,
      unitId: id!,
      name,
    })

    revalidateTag(`${currentOrg}/units`)
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
    message: 'Successfully saved the unit.',
    errors: null,
  }
}
