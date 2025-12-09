import { PenBoxIcon } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { getUnits } from '@/http/get-units'

export async function UnitList() {
  const currentOrg = await getCurrentOrg()
  const { units } = await getUnits(currentOrg!)

  return (
    <div className="flex w-full flex-col gap-6">
      {units.map((unit) => (
        <Item variant="outline" key={unit.id}>
          <ItemContent>
            <ItemTitle>{unit.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              <Link href={`/org/${currentOrg}/units/${unit.id}`}>
                <PenBoxIcon className="size-4" />
              </Link>
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}
