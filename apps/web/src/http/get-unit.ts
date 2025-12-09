import { api } from './api-client'

interface GetUnitResponse {
  unit: {
    id: string
    name: string
  }
}

export async function getUnit(org: string, unitId: string) {
  const result = await api
    .get(`organization/${org}/unit/${unitId}`)
    .json<GetUnitResponse>()

  return result
}
