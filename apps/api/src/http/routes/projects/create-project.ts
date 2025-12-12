import { projectAndStepStatusSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/project',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a new project.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
            startDate: z.string(),
            forecastDate: z.string(),
            endDate: z.string().optional(),
            status: projectAndStepStatusSchema.optional(),
            requestingDepartamentId: z.string(),
            managerId: z.string(),
            agentId: z.string().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            `You're not allowed to create new projects.`,
          )
        }

        const {
          name,
          description,
          forecastDate,
          startDate,
          endDate,
          status,
          requestingDepartamentId,
          managerId,
          agentId,
        } = request.body

        const agent = await prisma.member.findUnique({
          where: {
            id: agentId,
          },
        })

        const project = await prisma.project.create({
          data: {
            name: name.toUpperCase(),
            slug: createSlug(name),
            description,
            organizationId: userMembership.organizationId,
            status: status ?? 'WAITING',
            forecastDate: new Date(forecastDate),
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            requestingDepartamentId,
            managerId,
            agentId,
            agentDepartamentId: agent?.departamentId,
          },
        })

        return reply.status(201).send({
          projectId: project.id,
        })
      },
    )
}
