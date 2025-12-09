import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/unit/:unitId',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get an organization unit',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            unitId: z.string(),
          }),
          response: {
            200: z.object({
              unit: z.object({
                id: z.string().uuid(),
                name: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, unitId } = request.params

        await request.getUserMembership(slug)

        const unit = await prisma.unit.findUnique({
          select: {
            id: true,
            name: true,
          },
          where: {
            id: unitId,
          },
        })

        if (!unit) {
          throw new BadRequestError('Unit not found.')
        }

        return {
          unit,
        }
      },
    )
}
