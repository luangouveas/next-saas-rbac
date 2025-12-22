import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

interface GetProjectStepsResponse {
  steps: {
    description: string | null
    status: ProjectAndStepStatus
    projectId: string
    id: string
    name: string
    user: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    }
    createdAt: string
    updatedAt: string
    startDate: string
    forecastDate: string
    endDate: string | null
  }[]
  statusCount: {
    IN_PROGRESS: number
    STOPPED: number
    COMPLETED: number
    WAITING: number
  }
}

export async function getProjectStetps(org: string, projectSlug: string) {
  const result = await api
    .get(`organization/${org}/project/${projectSlug}/steps`, {
      next: {
        tags: [`${org}/project/${projectSlug}/steps`],
      },
    })
    .json<GetProjectStepsResponse>()

  return result
}
