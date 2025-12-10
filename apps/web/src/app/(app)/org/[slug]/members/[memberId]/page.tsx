import { ability, getCurrentOrg } from '@/auth/auth'
import { getMember } from '@/http/get-member'
import { getUnitDepartaments } from '@/http/get-unit-departaments'
import { getUnits } from '@/http/get-units'

import MemberForm from '../member-form'

interface MemberPageProps {
  params: Promise<{ memberId: string }>
}

export default async function MemberPage({ params }: MemberPageProps) {
  const currentOrg = await getCurrentOrg()
  const memberId = (await params).memberId

  const permissions = await ability()

  const { units } = await getUnits(currentOrg!)

  const { member } = await getMember(currentOrg!, memberId)

  const { departaments } = await getUnitDepartaments(
    currentOrg!,
    member.unit.id,
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Update member</h1>

      {permissions?.can('update', 'Member') ? (
        <MemberForm
          units={units}
          initialData={{
            avatarUrl: member.avatarUrl,
            name: member.name,
            departamentId: member.departament.id,
            id: member.id,
            role: member.role,
            unitId: member.unit.id,
          }}
          departamentsByUnitUser={departaments}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to update members in this organization.
        </p>
      )}
    </div>
  )
}
