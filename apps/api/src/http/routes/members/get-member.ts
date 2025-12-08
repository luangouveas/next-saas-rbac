import { memberSchema, roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                  unit: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                  departament: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        const authMember = memberSchema.parse({
          organizationId: userMembership.organizationId,
        })

        if (cannot('get', authMember)) {
          throw new UnauthorizedError(
            `You're not allowed to see organization members.`,
          )
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
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
          },
          where: {
            organizationId: userMembership.organizationId,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, departament, unit, ...member }) => {
            return {
              ...user,
              ...member,
              unit,
              departament,
              userId,
            }
          },
        )

        return reply.send({ members: membersWithRoles })
      },
    )
}
