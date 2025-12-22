'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

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
import { getActors } from '@/http/get-actors'

import { createProjectSetpAction, UpdateProjectStepSchema } from './actions'

interface ProjectStepFormProps {
  projectSlug?: string
  isUpdating?: boolean
  initialData?: UpdateProjectStepSchema
  onSuccess?: () => void
}

export function ProjectStepForm({
  projectSlug,
  isUpdating = false,
  initialData,
  onSuccess,
}: ProjectStepFormProps) {
  const [{ message, success }, handleSubmit, isPending] = useFormState(
    createProjectSetpAction,
    onSuccess,
  )

  const { slug: currentOrg } = useParams<{ slug: string }>()

  const { data: dataActors } = useQuery({
    queryKey: [currentOrg, 'actors'],
    queryFn: () => getActors(currentOrg),
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project step failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          type="text"
          defaultValue={initialData?.name}
        />

        {projectSlug && (
          <input type="hidden" name="projectSlug" value={projectSlug} />
        )}
        {isUpdating && initialData && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          maxLength={200}
          defaultValue={
            initialData?.description ? initialData?.description : undefined
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <DatePickerComponent
          name="startDate"
          enablePicker={false}
          defaultValue={initialData?.startDate}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="forecastDate">Forecast Date</Label>
        <DatePickerComponent
          name="forecastDate"
          enablePicker={false}
          defaultValue={initialData?.forecastDate}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <DatePickerComponent
          name="endDate"
          enablePicker={false}
          defaultValue={initialData?.endDate ? initialData?.endDate : undefined}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={initialData?.status}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WAITING">WAITING</SelectItem>
            <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
            <SelectItem value="STOPPED">STOPPED</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userId">User</Label>
        <Select name="userId" defaultValue={initialData?.userId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataActors?.actors.map((actor) => (
              <SelectItem key={actor.user.id} value={actor.user.id}>
                {actor.user.name ?? actor.user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project step'
        )}
      </Button>
    </form>
  )
}
