import { departamentSchema } from '@saas/auth/src/models/departament'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateDepartament(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/unit/:unitId/departament/:departamentId',
      {
        schema: {
          tags: ['Departaments'],
          summary: 'Update departament details.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          params: z.object({
            slug: z.string(),
            unitId: z.string(),
            departamentId: z.string(),
          }),
          response: {
            204: z.object({
              departament: z.object({
                id: z.string(),
                name: z.string(),
                organizationId: z.string(),
                unitId: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name } = request.body
        const { slug, departamentId, unitId } = request.params

        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        const authDepartament = departamentSchema.parse({
          id: departamentId,
          organizationId: userMembership.organizationId,
          unitId,
        })

        if (cannot('update', authDepartament)) {
          throw new UnauthorizedError(
            `You're not allowed to update this departament.`,
          )
        }

        const departamentByName = await prisma.departament.findFirst({
          where: {
            name,
            unitId,
            AND: {
              NOT: {
                id: departamentId,
              },
            },
          },
        })

        if (departamentByName) {
          throw new BadRequestError(
            'Another departament with same name already exists.',
          )
        }

        const departamentUpdated = await prisma.departament.update({
          where: {
            id: departamentId,
          },
          data: {
            name,
          },
        })

        return reply.status(204).send({
          departament: {
            id: departamentUpdated.id,
            name: departamentUpdated.name,
            organizationId: userMembership.organizationId,
            unitId,
          },
        })
      },
    )
}
