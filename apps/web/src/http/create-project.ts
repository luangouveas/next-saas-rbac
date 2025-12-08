import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
  startDate: string
  forecastDate: string
  endDate: string
  status: ProjectAndStepStatus
  requestingDepartamentId: string
  managerId: string
  agentId: string
}

type CreateProjectResponse = void

export async function createProject({
  org,
  name,
  description,
  status,
  startDate,
  forecastDate,
  endDate,
  agentId,
  managerId,
  requestingDepartamentId,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post(`organization/${org}/project`, {
    json: {
      name,
      description,
      status,
      startDate,
      forecastDate,
      endDate,
      agentId,
      managerId,
      requestingDepartamentId,
    },
  })
}
