import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/unit',
      {
        schema: {
          tags: ['Organizations'],
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
