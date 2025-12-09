import { ability, getCurrentOrg } from '@/auth/auth'
import { getUnits } from '@/http/get-units'

import { DepartamentForm } from '../departament-form'

export default async function CreateDepartament() {
  const permissions = await ability()
  const currentOrg = await getCurrentOrg()

  const { units } = await getUnits(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create departament</h1>

      {permissions?.can('create', 'Departament') ? (
        <DepartamentForm units={units} />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to create departaments in this organization.
        </p>
      )}
    </div>
  )
}
