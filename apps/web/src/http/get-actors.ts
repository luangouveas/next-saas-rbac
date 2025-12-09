import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetActorsResponse {
  actors: {
    id: string
    role: Role
    unit: {
      id: string
      name: string
    }
    departament: {
      id: string
      name: string
    }
    user: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    }
  }[]
}

export async function getActors(org: string) {
  const result = await api
    .get(`organization/${org}/actors`)
    .json<GetActorsResponse>()

  return result
}
