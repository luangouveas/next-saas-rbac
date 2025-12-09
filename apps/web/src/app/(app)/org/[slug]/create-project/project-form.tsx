'use client'

import { Role } from '@saas/auth'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import DatePickerComponent from '@/components/date-picker'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'
import { getUnitDepartaments } from '@/http/get-unit-departaments'
import { queryClient } from '@/lib/react-query'

import { createProjectAction } from './actions'

type Departament = {
  id: string
  name: string
  unit: {
    id: string
    name: string
  }
}

interface ProjectFormProps {
  actors: {
    id: string
    role: Role
    unit: {
      id: string
      name: string
    }
    departament: {
      id: string
      name: string
    }
    user: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    }
  }[]
  units: {
    id: string
    name: string
  }[]
}

export function ProjectForm({ actors, units }: ProjectFormProps) {
  const { slug: org } = useParams<{ slug: string }>()

  const [departaments, setDepartaments] = useState<Departament[]>([])

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createProjectAction,
    () => {
      queryClient.invalidateQueries({
        queryKey: [org, 'projects'],
      })
    },
  )

  async function getDepartamentsByUnidId(unitId: string) {
    const { departaments } = await getUnitDepartaments(org!, unitId)
    if (departaments) {
      setDepartaments(departaments)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
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

      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" id="name" />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="unitId">Unit</Label>
        <Select
          name="unitId"
          onValueChange={(unitId) => getDepartamentsByUnidId(unitId)}
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
        <Label htmlFor="requestingDepartamentId">Departament</Label>
        <Select name="requestingDepartamentId">
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

        {errors?.requestingDepartamentId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.requestingDepartamentId[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="startDate">Start Date</Label>
        <DatePickerComponent name="startDate" />

        {errors?.startDate && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.startDate[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="forecastDate">Forecast Date</Label>
        <DatePickerComponent name="forecastDate" />

        {errors?.forecastDate && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.forecastDate[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="managerId">Manager</Label>
        <Select name="managerId">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actors.map((actor) => (
              <SelectItem key={actor.user.id} value={actor.user.id}>
                {actor.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors?.managerId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.managerId[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="agentId">Agent</Label>
        <Select name="agentId">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actors.map((actor) => (
              <SelectItem key={actor.user.id} value={actor.user.id}>
                {actor.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors?.agentId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.agentId[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
