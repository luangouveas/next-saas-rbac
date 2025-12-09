import { api } from './api-client'

interface CreateUnitRequest {
  org: string
  name: string
}

interface CreateUnitResponse {
  organizationId: string
  unitId: string
}

export async function createUnit({ org, name }: CreateUnitRequest) {
  return await api.post<CreateUnitResponse>(`organization/${org}/unit`, {
    json: {
      name,
    },
  })
}
