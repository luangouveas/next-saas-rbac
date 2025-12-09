import { ProjectForm } from '@/app/(app)/org/[slug]/create-project/project-form'
import { getCurrentOrg } from '@/auth/auth'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getActors } from '@/http/get-actors'
import { getUnits } from '@/http/get-units'

export default async function CreateProject() {
  const currentOrg = await getCurrentOrg()

  const { actors } = await getActors(currentOrg!)
  const { units } = await getUnits(currentOrg!)

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create project</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm actors={actors} units={units} />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
