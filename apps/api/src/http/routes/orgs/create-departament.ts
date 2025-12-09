import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createDepartament(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/unit/:unitId/departament',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create a new departament.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            unitId: z.string(),
          }),
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
              unitId: z.string().uuid(),
              departamentId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name } = request.body
        const { slug, unitId } = request.params

        const userMembership = await request.getUserMembership(slug)

        const departamentUnitOrganizationByName =
          await prisma.departament.findFirst({
            where: {
              name,
              unitId,
            },
          })

        if (departamentUnitOrganizationByName) {
          throw new BadRequestError(
            'Another departament with same name already exists.',
          )
        }

        const departament = await prisma.departament.create({
          data: {
            name,
            unitId,
          },
        })

        await prisma.member.create({
          data: {
            departamentId: departament.id,
            unitId,
            organizationId: userMembership.organizationId,
            userId: userMembership.userId,
            role: 'ADMIN',
          },
        })

        return reply.status(201).send({
          organizationId: userMembership.organizationId,
          unitId: departament.id,
          departamentId: departament.id,
        })
      },
    )
}
