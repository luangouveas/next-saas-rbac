'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { SignUp } from '@/http/sign-up'

const SignUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your full name.',
    }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address.' }),
    password: z
      .string()
      .min(6, { message: 'Password should heave at leats 6 characters.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passowrd confirmation does not match.',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = SignUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data

  try {
    await SignUp({
      name,
      email,
      password,
    })

    return {
      success: true,
      message: null,
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
