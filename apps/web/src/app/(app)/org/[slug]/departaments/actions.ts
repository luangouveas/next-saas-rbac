'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createDepartament } from '@/http/create-departament'
import { updateDepartament } from '@/http/update-departament'

const departamentSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(4, { message: 'Please, incluide at least 4 characters.' }),
  unitId: z.string({ message: 'Please select an unit' }).uuid(),
})

export type DepartamentSchema = z.infer<typeof departamentSchema>

export async function createDepartamentAction(data: FormData) {
  const result = departamentSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: 'Validation Error', errors }
  }

  const { name, unitId } = result.data

  const currentOrg = await getCurrentOrg()

  try {
    await createDepartament({
      org: currentOrg!,
      name,
      unitId,
    })
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
    message: 'Successfully saved the departament.',
    errors: null,
  }
}

export async function updateDepartamentAction(data: FormData) {
  const result = departamentSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: 'Validation Error', errors }
  }

  const { name, unitId, id } = result.data

  const currentOrg = await getCurrentOrg()

  try {
    await updateDepartament({
      org: currentOrg!,
      departamentId: id!,
      name,
      unitId,
    })
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
    message: 'Successfully saved the departament.',
    errors: null,
  }
}
