import { api } from './api-client'

interface GetDeparaemtnResponse {
  departaments: {
    id: string
    name: string
    unit: {
      id: string
      name: string
    }
  }[]
}

export async function getDepartaments(org: string) {
  const result = await api
    .get(`organization/${org}/departaments`)
    .json<GetDeparaemtnResponse>()
  return result
}
