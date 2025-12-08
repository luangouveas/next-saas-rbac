import { Role } from '@saas/auth'

import { api } from './api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: Role
  unitId: string
  departamentId: string
}

type CreateInviteResponse = void

export async function createInvite({
  org,
  email,
  role,
  unitId,
  departamentId,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organization/${org}/invites`, {
    json: {
      email,
      role,
      unitId,
      departamentId,
    },
  })
}
