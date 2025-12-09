import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getUnitDepartaments(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/unit/:unitId/departaments',
      {
        schema: {
          tags: ['Departaments'],
          summary: 'Get all unit departaments',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            unitId: z.string(),
          }),
          response: {
            200: z.object({
              departaments: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  unit: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug, unitId } = request.params

        const userMembership = await request.getUserMembership(slug)
        const { cannot } = getUserPermissions(userMembership)

        if (cannot('get', 'Departament')) {
          throw new UnauthorizedError(
            `You're not allowed to see departaments in this organization.`,
          )
        }

        const departaments = await prisma.departament.findMany({
          select: {
            id: true,
            name: true,
            unit: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            unitId,
          },
        })

        return {
          departaments,
        }
      },
    )
}
