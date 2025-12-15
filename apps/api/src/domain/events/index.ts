import { Role } from '@saas/auth'

import { eventBus } from '@/infra/events/event-bus'

export interface InviteCreatedEvent {
  type: 'INVITE_CREATED'
  inviteId: string
  organizationId: string
  organizationName: string
  email: string
  role: Role
  authorId: string
  createdAt: Date
}

const events = {
  INVITE_CREATED_EVENT: {
    execute: (dataEvent: InviteCreatedEvent) => {
      eventBus.publish('INVITE_CREATED', dataEvent)
    },
  },
}

export const { INVITE_CREATED_EVENT } = events
