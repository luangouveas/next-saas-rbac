import { roleSchema } from '@saas/auth'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { eventBus } from '@/infra/events/event-bus'
import { prisma } from '@/lib/prisma'
import { createRandomPassword } from '@/utils/create-random-password'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create a new invite.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
            unitId: z.string(),
            departamentId: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userMembership)

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            `You're not allowed to create new invites.`,
          )
        }

        const { email, role, unitId, departamentId } = request.body

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: userMembership.organizationId,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exists.',
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: userMembership.organizationId,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'A member with this e-mail already exists belongs to your organization.',
          )
        }

        const organization = await prisma.organization.findUnique({
          where: {
            id: userMembership.organizationId,
          },
        })

        const invite = await prisma.invite.create({
          data: {
            organizationId: organization!.id,
            unitId,
            departamentId,
            email,
            role,
            authorId: userMembership.userId,
          },
        })

        const userAlreadyCreated = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!userAlreadyCreated) {
          const randomPassword = createRandomPassword()

          await prisma.user.create({
            data: {
              email,
              passwordHash: await hash(randomPassword, 6),
            },
          })
          console.log('Enviar email...')
          console.log(
            'Você recebeu um convite para participar de uma organização em [nome do app]',
          )
          console.log(
            `Clicando no link abaixo, você será redirecionado ao nosso site, onde poderá se autenticar com seu e-mail e a senha: ${randomPassword}`,
          )
        } else {
          console.log('Enviar email...')
          console.log(
            'Você recebeu um convite para participar de uma organização em [nome do app]',
          )
          console.log(
            `Clicando no link abaixo, você será redirecionado ao nosso site, onde poderá aceitar o convite`,
          )
        }

        eventBus.publish('INVITE_CREATED', {
          type: 'INVITE_CREATED',
          inviteId: invite.id,
          organizationId: userMembership.organizationId,
          organizationName: organization!.name,
          email: invite.email,
          role: invite.role,
          authorId: userMembership.userId,
          createdAt: invite.createdAt,
        })

        console.log(`http://localhost:3000/invite/${invite.id}`)

        return reply.status(201).send({
          inviteId: invite.id,
        })
      },
    )
}
