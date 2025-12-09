import { UnitForm } from '@/app/(app)/org/[slug]/units/unit-form'
import { ability, getCurrentOrg } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getUnit } from '@/http/get-unit'

interface UpdateUnitPageProps {
  params: Promise<{ unitId: string }>
}

export default async function UpdateUnit({ params }: UpdateUnitPageProps) {
  const permissions = await ability()

  const unitId = (await params).unitId
  const currentOrg = await getCurrentOrg()

  const { unit } = await getUnit(currentOrg!, unitId)

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create unit</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {permissions?.can('create', 'Unit') ? (
            <UnitForm initialData={unit} isUpdating={true} />
          ) : (
            <p className="text-sm text-muted-foreground">
              You are not allowed to create units in this organization.
            </p>
          )}
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
