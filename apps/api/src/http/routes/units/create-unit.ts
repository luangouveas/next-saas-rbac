import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/unit',
      {
        schema: {
          tags: ['Units'],
          summary: 'Create a new unit.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
              unitId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name } = request.body
        const { slug } = request.params

        const userMembership = await request.getUserMembership(slug)
        const { cannot } = getUserPermissions(userMembership)

        if (cannot('create', 'Unit')) {
          throw new UnauthorizedError(
            `You're not allowed to create units in this organization.`,
          )
        }

        const unitOrganizationByName = await prisma.unit.findFirst({
          where: {
            name,
            organizationId: userMembership.organizationId,
          },
        })

        if (unitOrganizationByName) {
          throw new BadRequestError(
            'Another unit with same name already exists.',
          )
        }

        const unit = await prisma.unit.create({
          data: {
            name,
            organizationId: userMembership.organizationId,
          },
        })

        return reply.status(201).send({
          organizationId: unit.organizationId,
          unitId: unit.id,
        })
      },
    )
}
