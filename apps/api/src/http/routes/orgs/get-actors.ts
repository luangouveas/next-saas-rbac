import { roleSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getActors(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/actors',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get all organization actors',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              actors: z.array(
                z.object({
                  id: z.string().uuid(),
                  role: roleSchema,
                  unit: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                  departament: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                  user: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    email: z.string(),
                    avatarUrl: z.string().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const actors = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            unit: {
              select: {
                id: true,
                name: true,
              },
            },
            departament: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: userMembership.organizationId,
          },
        })

        return {
          actors,
        }
      },
    )
}
