import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    description: string
    slug: string
    id: string
    name: string
    avatarUrl: string | null
    organizationId: string
    createdAt: Date
    startDate: Date
    forecastDate: Date
    endDate: Date | null
    status: ProjectAndStepStatus
    requestingDepartament: {
      id: string
      name: string
    }
    manager: {
      id: string
      name: string
      email: string
      avatarUrl: string | null
    }
    agent: {
      id: string
      name: string
      email: string
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(org: string) {
  const result = await api
    .get(`organization/${org}/projects`)
    .json<GetProjectsResponse>()

  return result
}
