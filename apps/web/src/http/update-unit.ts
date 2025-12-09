import { api } from './api-client'

interface UpdateUnitRequest {
  org: string
  unitId: string
  name: string
}

export async function updateUnit({ org, unitId, name }: UpdateUnitRequest) {
  await api.put(`organization/${org}/unit/${unitId}`, {
    json: { name },
  })
}
