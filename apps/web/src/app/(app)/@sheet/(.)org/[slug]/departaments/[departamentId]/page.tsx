import { DepartamentForm } from '@/app/(app)/org/[slug]/departaments/departament-form'
import { ability, getCurrentOrg } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getDepartament } from '@/http/get-departament'
import { getUnits } from '@/http/get-units'

interface UpdateDepartamentProps {
  params: Promise<{ departamentId: string }>
}

export default async function UpdateDepartament({
  params,
}: UpdateDepartamentProps) {
  const departamentId = (await params).departamentId
  const permissions = await ability()
  const currentOrg = await getCurrentOrg()

  const { units } = await getUnits(currentOrg!)
  const { departament } = await getDepartament(currentOrg!, departamentId)

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Update departament</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {permissions?.can('update', 'Departament') ? (
            <DepartamentForm
              units={units}
              initialData={departament}
              isUpdating={true}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              You are not allowed to update departaments in this organization.
            </p>
          )}
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
