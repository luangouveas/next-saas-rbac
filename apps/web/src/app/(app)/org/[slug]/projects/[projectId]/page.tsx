import { differenceInDays } from 'date-fns'
import { BadgeAlertIcon, BadgeCheckIcon } from 'lucide-react'

import { getCurrentOrg } from '@/auth/auth'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getProject } from '@/http/get-project'
import { getProjectStetps } from '@/http/get-projectSteps'
import { cn } from '@/lib/utils'

import { CreateProjectStepButton } from './create-projectStep-button'
import { ProjectStepsList } from './projectSteps-list'

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function Project({ params }: ProjectPageProps) {
  const projectSlug = (await params).projectId
  const currentOrg = await getCurrentOrg()

  const { project } = await getProject(currentOrg!, projectSlug)
  const { steps, statusCount } = await getProjectStetps(
    currentOrg!,
    projectSlug,
  )

  const slaOk = differenceInDays(new Date(project.forecastDate), new Date()) > 0

  const percent =
    statusCount.COMPLETED /
    (statusCount.COMPLETED +
      statusCount.IN_PROGRESS +
      statusCount.STOPPED +
      statusCount.WAITING)

  return (
    <div>
      <div className="min-h-[200px]">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold">
              <span className="text-2xl">{project.name}</span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-white',
                  slaOk
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : 'bg-red-500 dark:bg-red-600',
                )}
              >
                {slaOk ? (
                  <BadgeCheckIcon size="16" />
                ) : (
                  <BadgeAlertIcon size="16" />
                )}
                SLA
              </Badge>
            </div>

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

            <span>
              <span className="font-semibold">Status: </span>
              {project.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Progress value={percent} className="mt-16 w-full" />
          <span className="text-muted-foreground">
            {percent ? percent.toFixed(0) : 0} %
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Setps</h1>
          <CreateProjectStepButton projectSlug={project.slug} />
        </div>
        <div>{steps.length > 0 && <ProjectStepsList steps={steps} />}</div>
      </div>
    </div>
  )
}
