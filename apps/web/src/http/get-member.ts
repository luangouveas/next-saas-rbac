import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMemberResponse {
  member: {
    id: string
    userId: string
    role: Role
    name: string
    email: string
    avatarUrl: string | null
    unit: {
      id: string
      name: string
    }
    departament: {
      id: string
      name: string
    }
  }
}

export async function getMember(org: string, memberId: string) {
  const result = await api
    .get(`organization/${org}/members/${memberId}`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMemberResponse>()

  return result
}
