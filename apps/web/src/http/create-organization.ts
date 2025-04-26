import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateOrganizationResponse = void

export async function CreateOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api
    .post('organization', {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<CreateOrganizationResponse>()
}
