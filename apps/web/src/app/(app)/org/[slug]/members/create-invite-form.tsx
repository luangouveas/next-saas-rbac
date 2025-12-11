'use client'

import { AlertTriangle, Loader2, UserPlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'
import { getUnitDepartaments } from '@/http/get-unit-departaments'

import { createInviteAction } from './actions'

interface CreateInviteFormProps {
  units: { id: string; name: string }[]
}

type Departament = {
  id: string
  name: string
  unit: {
    id: string
    name: string
  }
}

export function CreateInviteForm({ units }: CreateInviteFormProps) {
  const { slug: org } = useParams<{ slug: string }>()

  const [departaments, setDepartaments] = useState<Departament[]>([])

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createInviteAction)

  async function buscarDepartamentos(unitId: string) {
    const { departaments } = await getUnitDepartaments(org, unitId)
    setDepartaments(departaments)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-start justify-center gap-2">
        <div className="flex-1 space-y-1">
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="john@example.com"
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="min-w-[210px] space-y-1">
          <Select name="unitId" onValueChange={buscarDepartamentos}>
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs text-muted-foreground">
                  Select a unit
                </SelectLabel>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors?.unitId && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.unitId[0]}
            </p>
          )}
        </div>

        <div className="min-w-[180px] space-y-1">
          <Select name="departamentId">
            <SelectTrigger>
              <SelectValue placeholder="Departament" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs text-muted-foreground">
                  {departaments.length === 0
                    ? 'First select a unit...'
                    : 'Select a departament'}
                </SelectLabel>
                {departaments.map((departament) => (
                  <SelectItem key={departament.id} value={departament.id}>
                    {departament.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors?.departamentId && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.departamentId[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Select name="role">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs text-muted-foreground">
                  Select a role
                </SelectLabel>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors?.role && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.role[0]}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Invite user
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
