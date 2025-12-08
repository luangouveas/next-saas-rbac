'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { createOrganizationAction } from './actions'

export function OrganizationForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createOrganizationAction,
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && !success && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {message && success && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input name="name" id="name" />
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="defaultUnitName">Default Unit name</Label>
        <Input name="defaultUnitName" id="defaultUnitName" />
        {errors?.defaultUnitName && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.defaultUnitName[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="defaultDepartamentName">Default Departament name</Label>
        <Input name="defaultDepartamentName" id="defaultDepartamentName" />
        {errors?.defaultDepartamentName && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.defaultDepartamentName[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
