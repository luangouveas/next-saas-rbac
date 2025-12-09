import { DepartamentForm } from '@/app/(app)/org/[slug]/departaments/departament-form'
import { ability, getCurrentOrg } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getUnits } from '@/http/get-units'

export default async function CreateOrganization() {
  const permissions = await ability()
  const currentOrg = await getCurrentOrg()

  const { units } = await getUnits(currentOrg!)

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create departament</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {permissions?.can('create', 'Departament') ? (
            <DepartamentForm units={units} />
          ) : (
            <p className="text-sm text-muted-foreground">
              You are not allowed to create departaments in this organization.
            </p>
          )}
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
