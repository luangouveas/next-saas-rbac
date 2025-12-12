import { ProjectAndStepStatus } from '@saas/auth'

import { api } from './api-client'

export type Project = {
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

export interface GetProjectsResponse {
  projects: Project[]
}

type Filtros = {
  requestingDepartamentId?: string
  agentDepartamentId?: string
  managerId?: string
  agentId?: string
  name?: string
}

const mapFilters = (filters: object) => {
  const entries = Object.entries(filters)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
  return entries.join('&')
}

export async function getProjects(org: string, filtros?: Filtros | null) {
  const querystring = filtros ? `?${mapFilters(filtros)}` : ''

  const result = await api
    .get(`organization/${org}/projects${querystring}`, {
      next: {
        tags: [`${org}/projects`],
      },
    })
    .json<GetProjectsResponse>()

  return result
}
