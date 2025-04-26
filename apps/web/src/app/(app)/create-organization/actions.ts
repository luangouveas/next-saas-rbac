'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { CreateOrganization } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Please include at leats 4 characters.',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please include a valid domain.' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === 'on' || value === true)
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Please include a domain if you want to attach users by domain.',
      path: ['domain'],
    },
  )

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

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await CreateOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
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
