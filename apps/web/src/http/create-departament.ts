import { api } from './api-client'

interface CreateDepartamentRequest {
  org: string
  unitId: string
  name: string
}

interface CreateDepartamentResponse {
  organizationId: string
  unitId: string
  departamentId: string
}

export async function createDepartament({
  org,
  unitId,
  name,
}: CreateDepartamentRequest) {
  return await api.post<CreateDepartamentResponse>(
    `organization/${org}/unit/${unitId}/departament`,
    {
      json: {
        name,
      },
    },
  )
}
