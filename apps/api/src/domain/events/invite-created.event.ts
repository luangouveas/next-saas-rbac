export interface InviteCreatedEvent {
  type: 'INVITE_CREATED'
  inviteId: string
  organizationId: string
  organizationName: string
  email: string
  role: string
  authorId: string
  createdAt: Date
}
