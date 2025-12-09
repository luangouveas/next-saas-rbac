import { api } from './api-client'

interface GetUnitDepartamentsResponse {
  departaments: {
    id: string
    name: string
    unit: {
      id: string
      name: string
    }
  }[]
}

export async function getUnitDepartaments(org: string, unitId: string) {
  console.log(org, unitId)
  const result = await api
    .get(`organization/${org}/unit/${unitId}/departaments`)
    .json<GetUnitDepartamentsResponse>()

  return result
}
