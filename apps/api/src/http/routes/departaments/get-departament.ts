import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getDepartament(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/departament/:departamentId',
      {
        schema: {
          tags: ['Departaments'],
          summary: 'Get an departament',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            departamentId: z.string(),
          }),
          response: {
            200: z.object({
              departament: z.object({
                id: z.string().uuid(),
                unitId: z.string().uuid(),
                name: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, departamentId } = request.params

        const userMembership = await request.getUserMembership(slug)
        const { cannot } = getUserPermissions(userMembership)

        if (cannot('get', 'Departament')) {
          throw new UnauthorizedError(
            `You're not allowed to see departaments in this organization.`,
          )
        }

        const departament = await prisma.departament.findUnique({
          select: {
            id: true,
            name: true,
            unitId: true,
          },
          where: {
            id: departamentId,
          },
        })

        if (!departament) {
          throw new BadRequestError('Departament not found.')
        }

        return {
          departament,
        }
      },
    )
}
