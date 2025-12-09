import { getCurrentOrg } from '@/auth/auth'
import { getUnit } from '@/http/get-unit'

import { UnitForm } from '../unit-form'

interface UpdateUnitPageProps {
  params: Promise<{ unitId: string }>
}

export default async function UpdateUnit({ params }: UpdateUnitPageProps) {
  const unitId = (await params).unitId
  const currentOrg = await getCurrentOrg()

  const { unit } = await getUnit(currentOrg!, unitId)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Update unit</h1>

      <UnitForm isUpdating={true} initialData={unit} />
    </div>
  )
}
