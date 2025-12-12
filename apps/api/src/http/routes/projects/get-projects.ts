import { projectAndStepStatusSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all organization projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            requestingDepartamentId: z.string().optional(),
            agentDepartamentId: z.string().optional(),
            managerId: z.string().optional(),
            agentId: z.string().optional(),
            name: z.string().optional(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
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
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const searchParams = request.query
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            `You're not allowed to see organization projects.`,
          )
        }

        const whereFilters = searchParams
          ? {
              agentId: searchParams.agentId ?? undefined,
              managerId: searchParams.managerId ?? undefined,
              name: searchParams.name
                ? { contains: searchParams.name.toUpperCase() }
                : undefined,
              requestingDepartamentId:
                searchParams.requestingDepartamentId ?? undefined,
              agentDepartamentId: searchParams.agentDepartamentId ?? undefined,
            }
          : undefined

        const projects = await prisma.project.findMany({
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
            organizationId: userMembership.organizationId,
            ...whereFilters,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.send({ projects })
      },
    )
}
