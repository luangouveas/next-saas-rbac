import { projectAndStepStatusSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProjectStep(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/project/:projectSlug/step',
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
            status: projectAndStepStatusSchema,
            userId: z.string(),
          }),
          params: z.object({
            slug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            201: z.object({
              projectStepId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectSlug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        if (cannot('create', 'ProjectStep')) {
          throw new UnauthorizedError(
            `You're not allowed to create new project steps.`,
          )
        }

        const {
          name,
          description,
          forecastDate,
          startDate,
          endDate,
          status,
          userId,
        } = request.body

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
          },
        })

        if (!project) {
          throw new BadRequestError(`Project not found.`)
        }

        const projectStep = await prisma.projectStep.create({
          data: {
            projectId: project.id,
            name,
            description,
            status,
            forecastDate: new Date(forecastDate),
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            userId,
          },
        })

        return reply.status(201).send({
          projectStepId: projectStep.id,
        })
      },
    )
}
