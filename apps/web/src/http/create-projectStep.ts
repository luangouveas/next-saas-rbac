import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

interface CreateProjectStepRequest {
  org: string
  data: {
    name: string
    description: string | null
    startDate: string
    forecastDate: string
    endDate?: string | null
    status: ProjectAndStepStatus
    userId: string
    projectSlug: string
  }
}

type CreateProjectStepResponse = void

export async function createProjectStep({
  org,
  data,
}: CreateProjectStepRequest): Promise<CreateProjectStepResponse> {
  await api.post(`organization/${org}/project/${data.projectSlug}/step`, {
    json: data,
  })
}
