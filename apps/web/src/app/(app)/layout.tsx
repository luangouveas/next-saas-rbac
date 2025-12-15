import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

import { NotificationsProvider } from '../providers/notifications-provider'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (await !isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <NotificationsProvider>
      {children}
      {sheet}
    </NotificationsProvider>
  )
}
