import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

interface GetProjectResponse {
  project: {
    id: string
    description: string
    name: string
    slug: string
    avatarUrl: string | null
    organizationId: string
    createdAt: Date
    startDate: Date
    forecastDate: Date
    endDate: Date | null
    status: ProjectAndStepStatus
    agentDepartament: {
      id: string
      name: string
    } | null
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
    } | null
  }
}

export async function getProject(org: string, project: string) {
  const result = await api
    .get(`organization/${org}/projects/${project}`, {
      next: {
        tags: [`projects/${project}`],
      },
    })
    .json<GetProjectResponse>()

  return result
}
