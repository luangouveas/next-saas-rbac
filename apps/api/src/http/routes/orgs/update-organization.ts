import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update organization details.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.object({
              organization: z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name } = request.body
        const { slug } = request.params

        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        const authOrganization = organizationSchema.parse({
          id: userMembership.organizationId,
          ownerId: userMembership.organizationOwnerId,
        })

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed to update this organization.`,
          )
        }

        const newSlug = createSlug(name)

        const organizationBySlug = await prisma.organization.findUnique({
          where: {
            slug: newSlug,
          },
        })

        if (organizationBySlug) {
          throw new BadRequestError(
            'Another organization with same name already exists.',
          )
        }

        const organization = await prisma.organization.update({
          where: {
            id: userMembership.organizationId,
          },
          data: {
            name,
            slug: newSlug,
          },
        })

        return reply.status(204).send({
          organization: {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
          },
        })
      },
    )
}
