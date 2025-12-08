import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organization/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Shutdown organization.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        const authOrganization = organizationSchema.parse({
          id: userMembership.organizationId,
          ownerId: userMembership.organizationOwnerId,
        })

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed to shutdown this organization.`,
          )
        }

        await prisma.organization.delete({
          where: {
            id: userMembership.organizationId,
          },
        })

        return reply.status(204).send()
      },
    )
}
