import { auth } from '@/auth/auth'

export default async function Home() {
  const { user } = await auth()
  return <>{JSON.stringify(user, null, 2)}</>
}
