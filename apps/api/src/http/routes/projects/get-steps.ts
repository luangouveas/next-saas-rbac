import { projectAndStepStatusSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getProjectSteps(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/project/:projectSlug/steps',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all project steps',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              steps: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  description: z.string().nullable(),
                  projectId: z.string(),
                  status: projectAndStepStatusSchema,
                  user: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    email: z.string(),
                    avatarUrl: z.string().nullable(),
                  }),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  startDate: z.date(),
                  forecastDate: z.date(),
                  endDate: z.date().nullable(),
                }),
              ),
              statusCount: z.object({
                IN_PROGRESS: z.number(),
                STOPPED: z.number(),
                COMPLETED: z.number(),
                WAITING: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params

        await request.getUserMembership(orgSlug)

        const steps = await prisma.projectStep.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            projectId: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            createdAt: true,
            updatedAt: true,
            startDate: true,
            forecastDate: true,
            endDate: true,
          },
          where: {
            project: {
              slug: projectSlug,
            },
          },
        })

        const statusCount = {
          IN_PROGRESS: steps.filter((s) => s.status === 'IN_PROGRESS').length,
          STOPPED: steps.filter((s) => s.status === 'STOPPED').length,
          COMPLETED: steps.filter((s) => s.status === 'COMPLETED').length,
          WAITING: steps.filter((s) => s.status === 'WAITING').length,
        }

        return reply.send({ steps, statusCount })
      },
    )
}
