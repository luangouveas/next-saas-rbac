import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function updateProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/profile',
      {
        schema: {
          tags: ['Auth'],
          summary: 'update authenticated user profile',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            email: z.string().optional(),
            newPassword: z.string().min(6).optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, email, newPassword } = request.body

        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        const passwordHash = newPassword
          ? await hash(newPassword, 6)
          : user.passwordHash

        await prisma.user.update({
          data: {
            name,
          },
          where: {
            id: userId,
            email: email ?? user.email,
            passwordHash,
          },
        })

        return reply.status(204).send(null)
      },
    )
}
