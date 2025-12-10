import { Role } from '@saas/auth'

import { api } from './api-client'

interface UpdateMemberRequest {
  org: string
  memberId: string
  unitId?: string
  departamentId?: string
  role: Role
}

export async function updateMember({
  org,
  memberId,
  role,
  departamentId,
  unitId,
}: UpdateMemberRequest) {
  await api.put(`organization/${org}/members/${memberId}`, {
    json: { role, departamentId, unitId },
  })
}
