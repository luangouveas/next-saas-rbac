import { getCurrentOrg } from '@/auth/auth'
import { getProject } from '@/http/get-project'

interface ProjectPageProps {
  params: Promise<{ project: string }>
}

export default async function Project({ params }: ProjectPageProps) {
  const projectSlug = (await params).project
  const currentOrg = await getCurrentOrg()

  const { project } = await getProject(currentOrg!, projectSlug)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Details about {project.name}</h1>
    </div>
  )
}
