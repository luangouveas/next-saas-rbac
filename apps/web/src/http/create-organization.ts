import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  defaultUnitName: string
  defaultDepartamentName: string
}

type CreateOrganizationResponse = void

export async function CreateOrganization({
  name,
  defaultUnitName,
  defaultDepartamentName,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api
    .post('organization', {
      json: {
        name,
        defaultUnitName,
        defaultDepartamentName,
      },
    })
    .json<CreateOrganizationResponse>()
}
