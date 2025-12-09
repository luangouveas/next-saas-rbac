import { ability, getCurrentOrg } from '@/auth/auth'
import { getDepartament } from '@/http/get-departament'
import { getUnits } from '@/http/get-units'

import { DepartamentForm } from '../departament-form'

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Update departament</h1>

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
  )
}
