import Header from '@/components/header'
import { getProfile } from '@/http/get-profile'

import { UserProfileForm } from './profileForm'

export default async function UserProfilePage() {
  const { user } = await getProfile()

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <UserProfileForm initialData={user} />
      </main>
    </div>
  )
}
