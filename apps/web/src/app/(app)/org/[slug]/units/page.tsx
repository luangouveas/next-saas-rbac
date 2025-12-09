import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { UnitList } from './unit-list'

export default async function Units() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Units</h1>

        {permissions?.can('create', 'Unit') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/units/create`}>
              <Plus className="mr-2 size-4" />
              Create unit
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Unit') ? (
        <UnitList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see organization units.
        </p>
      )}
    </div>
  )
}
