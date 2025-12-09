import { ability } from '@/auth/auth'

import { DepartamentList } from './departament-list'

export default async function Units() {
  const permissions = await ability()

  const canCreateDepartaments = permissions?.can('create', 'Departament')

  return (
    <div className="space-y-4">
      {permissions?.can('get', 'Departament') ? (
        <DepartamentList canCreateDepartaments={canCreateDepartaments} />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see units departaments.
        </p>
      )}
    </div>
  )
}
