import MemberForm from '@/app/(app)/org/[slug]/members/member-form'
import { ability, getCurrentOrg } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getMember } from '@/http/get-member'
import { getUnitDepartaments } from '@/http/get-unit-departaments'
import { getUnits } from '@/http/get-units'

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
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Update member</SheetTitle>
        </SheetHeader>

        <div className="py-4">
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
      </InterceptedSheetContent>
    </Sheet>
  )
}
