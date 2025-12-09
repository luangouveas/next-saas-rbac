import { UnitForm } from '@/app/(app)/org/[slug]/units/unit-form'
import { ability } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default async function CreateUnit() {
  const permissions = await ability()

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Update unit</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {permissions?.can('update', 'Unit') ? (
            <UnitForm />
          ) : (
            <p className="text-sm text-muted-foreground">
              You are not allowed to update units in this organization.
            </p>
          )}
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
