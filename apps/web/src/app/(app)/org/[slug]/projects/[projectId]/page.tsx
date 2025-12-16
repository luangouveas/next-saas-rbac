import { differenceInDays } from 'date-fns'
import { Plus } from 'lucide-react'

import { getCurrentOrg } from '@/auth/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProject } from '@/http/get-project'

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function Project({ params }: ProjectPageProps) {
  const projectSlug = (await params).projectId
  const currentOrg = await getCurrentOrg()

  const { project } = await getProject(currentOrg!, projectSlug)
  const { steps } = await getProjectStetps(currentOrg!, projectId)

  const slaOk = differenceInDays(new Date(project.forecastDate), new Date()) > 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="flex flex-col space-y-4">
          <span className="relative text-2xl font-bold">
            {project.name}
            <Badge
              className="absolute top-0 font-semibold"
              variant={slaOk ? 'success' : 'destructive'}
            >
              SLA
            </Badge>
          </span>

          <span className="text-muted-foreground">{project.description}</span>
        </div>

        <div className="flex flex-col">
          <span>
            <span className="font-semibold">Start Date: </span>
            {new Date(project.startDate).toLocaleDateString('pt-Br')}
          </span>

          <span>
            <span className="font-semibold">Forecast Date: </span>
            {new Date(project.forecastDate).toLocaleDateString('pt-Br')}
          </span>

          <span>
            <span className="font-semibold">End Date: </span>
            {project.endDate &&
              new Date(project.endDate).toLocaleDateString('pt-Br')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <h1 className="text-xl font-bold">Setps</h1>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Create Step
        </Button>
      </div>
    </div>
  )
}
