import { api } from './api-client'

interface UpdateDepartamentRequest {
  org: string
  unitId: string
  departamentId: string
  name: string
}

export async function updateDepartament({
  org,
  unitId,
  departamentId,
  name,
}: UpdateDepartamentRequest) {
  await api.put(
    `organization/${org}/unit/${unitId}/departament/${departamentId}`,
    {
      json: { name },
    },
  )
}
