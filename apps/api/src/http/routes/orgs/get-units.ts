import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getUnits(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/units',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get all organization units',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              units: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const userMembership = await request.getUserMembership(slug)

        const units = await prisma.unit.findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            organizationId: userMembership.organizationId,
          },
        })

        return {
          units,
        }
      },
    )
}
