import { redirect } from 'next/navigation'

import { ability, getCurrentOrg } from '@/auth/auth'
import { getActors } from '@/http/get-actors'
import { getUnits } from '@/http/get-units'

import { ProjectForm } from '../project-form'

export default async function CreateProject() {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  const currentOrg = await getCurrentOrg()

  const { actors } = await getActors(currentOrg!)
  const { units } = await getUnits(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create project</h1>

      <ProjectForm actors={actors} units={units} />
    </div>
  )
}
