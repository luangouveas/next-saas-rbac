import { unitSchema } from '@saas/auth/src/models/unit'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/unit/:unitId',
      {
        schema: {
          tags: ['Units'],
          summary: 'Update unit details.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          params: z.object({
            slug: z.string(),
            unitId: z.string(),
          }),
          response: {
            204: z.object({
              unit: z.object({
                id: z.string(),
                name: z.string(),
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name } = request.body
        const { slug, unitId } = request.params

        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        const authUnit = unitSchema.parse({
          id: unitId,
          organizationId: userMembership.organizationId,
        })

        if (cannot('update', authUnit)) {
          throw new UnauthorizedError(`You're not allowed to update this unit.`)
        }

        const unitByName = await prisma.unit.findFirst({
          where: {
            name,
            organizationId: userMembership.organizationId,
          },
        })

        if (unitByName) {
          throw new BadRequestError(
            'Another unit with same name already exists.',
          )
        }

        const unitUpdated = await prisma.unit.update({
          where: {
            id: unitId,
          },
          data: {
            name,
          },
        })

        return reply.status(204).send({
          unit: {
            id: unitUpdated.id,
            name: unitUpdated.name,
            organizationId: unitUpdated.organizationId,
          },
        })
      },
    )
}
