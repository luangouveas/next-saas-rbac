import { projectAndStepStatusSchema, projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().uuid(),
                description: z.string(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                organizationId: z.string().uuid(),
                createdAt: z.date(),
                startDate: z.date(),
                forecastDate: z.date(),
                endDate: z.date().nullable(),
                status: projectAndStepStatusSchema.nullable(),
                agentDepartament: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                  })
                  .nullable(),
                requestingDepartament: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                }),
                manager: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  email: z.string(),
                  avatarUrl: z.string().url().nullable(),
                }),
                agent: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    email: z.string(),
                    avatarUrl: z.string().url().nullable(),
                  })
                  .nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const userMembership = await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(userMembership)

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            startDate: true,
            forecastDate: true,
            endDate: true,
            status: true,
            agentDepartament: {
              select: {
                id: true,
                name: true,
              },
            },
            requestingDepartament: {
              select: {
                id: true,
                name: true,
              },
            },
            manager: {
              select: {
                id: true,
                avatarUrl: true,
                email: true,
                name: true,
              },
            },
            agent: {
              select: {
                id: true,
                avatarUrl: true,
                email: true,
                name: true,
              },
            },
          },
          where: {
            slug: projectSlug,
            organizationId: userMembership.organizationId,
          },
        })

        if (!project) {
          console.log('Project not found.')
          throw new BadRequestError('Project not found.')
        }

        const authProject = projectSchema.parse({
          id: project.id,
          organizationId: project.organizationId,
          requestingDepartamentId: project.requestingDepartament.id,
          managerId: project.manager.id,
          agentId: project.agent?.id,
          status: project.status,
        })

        if (cannot('get', authProject)) {
          throw new UnauthorizedError(
            `You're not allowed to see this projects.`,
          )
        }

        return reply.send({ project })
      },
    )
}
