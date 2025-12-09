'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

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
import { useFormState } from '@/hooks/use-form-state'
import { queryClient } from '@/lib/react-query'

import {
  createDepartamentAction,
  DepartamentSchema,
  updateDepartamentAction,
} from './actions'

interface DepartamentFormProps {
  isUpdating?: boolean
  initialData?: DepartamentSchema
  units: {
    id: string
    name: string
  }[]
}

export function DepartamentForm({
  isUpdating = false,
  initialData,
  units,
}: DepartamentFormProps) {
  const { slug: org } = useParams<{ slug: string }>()
  //   const router = useRouter()

  const formAction = isUpdating
    ? updateDepartamentAction
    : createDepartamentAction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {
      queryClient.invalidateQueries({
        queryKey: [`${org}-unit`, 'departaments'],
      })
      //   router.push(`/org/${org}/departaments`)
    },
  )

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

      <div className="space-y-1">
        <Label htmlFor="unitId">Unit</Label>

        {initialData && (
          <>
            <input type="hidden" name="unitId" value={initialData?.unitId} />
            <input type="hidden" name="id" value={initialData?.id} />
          </>
        )}

        <Select
          name="SelectUnitId"
          defaultValue={initialData?.unitId}
          disabled={!!initialData?.unitId}
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
        <Label htmlFor="name">Departament name</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save departament'
        )}
      </Button>
    </form>
  )
}
