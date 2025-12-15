import { InviteCreatedEvent } from '@/domain/events'
import { eventBus } from '@/infra/events/event-bus'
import { prisma } from '@/lib/prisma'

import { sendToUser } from '../sse-connections.store'

eventBus.subscribe<InviteCreatedEvent>('INVITE_CREATED', async (dataEvent) => {
  // 1. Buscar usuário (destinatario) pelo email
  const user = await prisma.user.findUnique({
    where: { email: dataEvent.email },
    select: { id: true },
  })

  // 2. Se o usuário ainda não existe, não há quem notificar
  if (!user) {
    return
  }

  // 3. Enviar notificação via SSE
  sendToUser(user.id, dataEvent)

  // console.log('Evento INVITE_CREATED recebido:', event)
})
