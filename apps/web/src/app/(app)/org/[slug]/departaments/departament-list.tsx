'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, PenBoxIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUnitDepartaments } from '@/http/get-unit-departaments'
import { getUnits } from '@/http/get-units'
import { queryClient } from '@/lib/react-query'

interface DepartamentListProps {
  preSelectedUnitId?: string
  canCreateDepartaments?: boolean
}

export function DepartamentList({
  preSelectedUnitId,
  canCreateDepartaments = false,
}: DepartamentListProps) {
  const { slug: currentOrg } = useParams<{ slug: string }>()
  const [unitId, setUnitId] = useState<string | null>(preSelectedUnitId ?? null)

  const { data: dataUnits } = useQuery({
    queryKey: [currentOrg, 'units'],
    queryFn: () => getUnits(currentOrg!),
  })

  const { data: dataDepartaments, isLoading: isLoadingDepartaments } = useQuery(
    {
      queryKey: [`${currentOrg}-unit`, 'departaments'],
      queryFn: () => getUnitDepartaments(currentOrg!, unitId!),
      enabled: !!unitId,
    },
  )

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [`${currentOrg}-unit`, 'departaments'],
    })
  }, [unitId])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <Label>Select a unit</Label>
        <Select
          name="requestingDepartamentId"
          onValueChange={(v) => {
            setUnitId(v)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <>
              <SelectItem key="1asasas" value="0">
                Selecione...
              </SelectItem>
              {dataUnits &&
                dataUnits.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
            </>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Departaments</h1>

        {canCreateDepartaments && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/departaments/create`}>
              <Plus className="mr-2 size-4" />
              Create departament
            </Link>
          </Button>
        )}
      </div>

      {isLoadingDepartaments ? (
        <div className="space-x-2">
          <Loader2 className="size-4 animate-ping" /> Carregando
        </div>
      ) : (
        <>
          {dataDepartaments &&
            unitId &&
            dataDepartaments.departaments.map((departament) => (
              <Item variant="outline" key={departament.id}>
                <ItemContent>
                  <ItemTitle>{departament.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    <Link
                      href={`/org/${currentOrg}/departaments/${departament.id}`}
                    >
                      <PenBoxIcon className="size-4" />
                    </Link>
                  </Button>
                </ItemActions>
              </Item>
            ))}
        </>
      )}
    </div>
  )
}
