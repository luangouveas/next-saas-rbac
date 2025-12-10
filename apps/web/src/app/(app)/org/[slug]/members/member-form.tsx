'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'
import { getUnitDepartaments } from '@/http/get-unit-departaments'

import { MemberSchema, updateMemberAction } from './actions'

type Departament = {
  id: string
  name: string
  unit: {
    id: string
    name: string
  }
}

interface MemberFormProps {
  initialData: MemberSchema & { name: string; avatarUrl?: string | null }
  units: {
    id: string
    name: string
  }[]
  departamentsByUnitUser: Departament[]
}

export default function MemberForm({
  initialData,
  units,
  departamentsByUnitUser,
}: MemberFormProps) {
  const { slug: org } = useParams<{ slug: string }>()

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(updateMemberAction)

  const [departaments, setDepartaments] = useState<Departament[]>(
    departamentsByUnitUser,
  )

  async function buscarDepartamentos(unitId: string) {
    const { departaments } = await getUnitDepartaments(org, unitId)
    setDepartaments(departaments)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback />
          {initialData.avatarUrl && (
            <Image
              src={initialData.avatarUrl}
              width={32}
              height={32}
              alt=""
              className="aspect-square size-full"
            />
          )}
        </Avatar>
        <h1 className="text-lg font-medium">{initialData.name}</h1>
      </div>

      <div className="space-y-1">
        <Label htmlFor="unitId">Unit</Label>
        <input type="hidden" name="unitId" value={initialData.id} />

        <Select
          name="unitId"
          onValueChange={buscarDepartamentos}
          value={initialData.unitId}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors?.unitId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.unitId[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="departamentId">Departament</Label>
        <input
          type="hidden"
          name="departamentId"
          value={initialData.departamentId}
        />

        <Select name="departamentId" value={initialData.departamentId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {departaments.map((departament) => (
              <SelectItem key={departament.id} value={departament.id}>
                {departament.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors?.unitId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.unitId[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save member'
        )}
      </Button>
    </form>
  )
}
