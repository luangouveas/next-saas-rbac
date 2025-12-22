import { ProjectAndStepStatus } from '@saas/auth'
import { addDays, differenceInDays, format } from 'date-fns'
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { UpdateProjectStepButton } from './update-projectStep-button'

interface ProjectStepsList {
  steps: {
    description: string | null
    status: ProjectAndStepStatus
    id: string
    name: string
    projectId: string
    user: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    }
    createdAt: string
    updatedAt: string
    startDate: string
    forecastDate: string
    endDate: string | null
  }[]
}

export function ProjectStepsList({ steps }: ProjectStepsList) {
  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead>Step Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Forecast Date</TableHead>
          <TableHead>SLA</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <tbody aria-hidden="true" className="table-row h-2" />
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {steps.map((step) => {
          const slaOk =
            differenceInDays(new Date(step.forecastDate), new Date()) > 0

          return (
            <TableRow
              className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50"
              key={step.id}
            >
              <TableCell className="py-2.5 font-medium">{step.name}</TableCell>
              <TableCell className="py-2.5">{step.description}</TableCell>
              <TableCell className="py-2.5">
                {step.user.name ?? step.user.email}
              </TableCell>
              <TableCell className="py-2.5">{step.status}</TableCell>
              <TableCell className="py-2.5">
                {format(addDays(new Date(step.forecastDate), 1), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="py-2.5">
                {slaOk ? (
                  <CheckCircle2Icon className="size-5 text-green-700" />
                ) : (
                  <XCircleIcon className="size-5 text-red-700" />
                )}
              </TableCell>
              <TableCell>
                <UpdateProjectStepButton
                  initialData={{
                    id: step.id,
                    description: step.description,
                    forecastDate: step.forecastDate,
                    name: step.name,
                    startDate: step.startDate,
                    status: step.status,
                    userId: step.user.id,
                    endDate: step.endDate,
                  }}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <tbody aria-hidden="true" className="table-row h-2" />
    </Table>
  )
}
