import { InviteCreatedEvent } from '@/domain/events/invite-created.event'
import { eventBus } from '@/infra/events/event-bus'
import { prisma } from '@/lib/prisma'

import { sendToUser } from '../sse-connections.store'

eventBus.subscribe<InviteCreatedEvent>('INVITE_CREATED', async (event) => {
  // 1. Buscar usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email: event.email },
    select: { id: true },
  })

  // 2. Se o usuário ainda não existe, não há quem notificar
  if (!user) {
    return
  }

  // 3. Enviar notificação via SSE
  sendToUser(user.id, {
    type: 'INVITE_CREATED',
    organizationId: event.organizationId,
    organizationName: event.organizationName,
    role: event.role,
    createdAt: event.createdAt,
  })

  // console.log('Evento INVITE_CREATED recebido:', event)
})
