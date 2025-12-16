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
      '/organization/:orgSlug/project/:projectId/steps',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all project steps',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectId: z.string(),
          }),
          response: {
            200: z.object({
              steps: z.array(
                z.object({
                  id: z.string().uuid(),
                  description: z.string().nullable(),
                  name: z.string(),
                  status: projectAndStepStatusSchema,
                  projectId: z.string(),
                  createdAt: z.string(),
                  startDate: z.string(),
                  forecastDate: z.string(),
                  endDate: z.string().nullable(),
                  updatedAt: z.string(),
                  userId: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectId } = request.params

        await request.getUserMembership(orgSlug)

        const projectSteps = await prisma.projectStep.findMany({
          where: {
            id: projectId,
          },
        })

        const statusCount = {
          IN_PROGRESS: projectSteps.filter((s) => s.status === 'IN_PROGRESS')
            .length,
          STOPPED: projectSteps.filter((s) => s.status === 'STOPPED').length,
          COMPLETED: projectSteps.filter((s) => s.status === 'COMPLETED')
            .length,
          WAITING: projectSteps.filter((s) => s.status === 'WAITING').length,
        }

        const steps = {
          ...projectSteps,
          statusCount,
        }

        return reply.send({ steps })
      },
    )
}
