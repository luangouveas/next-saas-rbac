import { api } from './api-client'

interface GetDeparaemtnResponse {
  departament: {
    id: string
    name: string
    unitId: string
  }
}

export async function getDepartament(org: string, departamentId: string) {
  const result = await api
    .get(`organization/${org}/departament/${departamentId}`)
    .json<GetDeparaemtnResponse>()

  return result
}
