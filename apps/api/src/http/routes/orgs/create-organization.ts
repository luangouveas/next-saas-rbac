import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create a new organization.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            defaultUnitName: z.string(),
            defaultDepartamentName: z.string(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, defaultUnitName, defaultDepartamentName } = request.body

        const slug = createSlug(name)

        const organizationBySlug = await prisma.organization.findUnique({
          where: {
            slug,
          },
        })

        if (organizationBySlug) {
          throw new BadRequestError(
            'Another organization with same name already exists.',
          )
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug,
            ownerId: userId,
          },
        })

        const unit = await prisma.unit.create({
          data: {
            organizationId: organization.id,
            name: defaultUnitName,
          },
        })

        const departament = await prisma.departament.create({
          data: {
            unitId: unit.id,
            name: defaultDepartamentName,
          },
        })

        await prisma.member.create({
          data: {
            userId,
            role: 'ADMIN',
            unitId: unit.id,
            departamentId: departament.id,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      },
    )
}
