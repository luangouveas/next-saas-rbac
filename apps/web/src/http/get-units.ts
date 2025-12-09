import { api } from './api-client'

interface GetUnitsResponse {
  units: {
    id: string
    name: string
  }[]
}

export async function getUnits(org: string) {
  const result = await api
    .get(`organization/${org}/units`, {
      next: {
        tags: [`${org}/units`],
      },
    })
    .json<GetUnitsResponse>()

  return result
}
