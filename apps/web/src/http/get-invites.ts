import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
    departament: {
      id: string
      name: string
    }
    unit: {
      id: string
      name: string
    }
  }[]
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organization/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return result
}
