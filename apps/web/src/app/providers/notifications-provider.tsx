'use client'

import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type NotificationMessage = {
  type: 'INVITE_CREATED'
  organizationId: string
  organizationName: string
  role: string
  createdAt: string
}

type NotificationsContextType = {
  hasNewInvite: boolean
  clearNewInvite: () => void
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null,
)

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [hasNewInvite, setHasNewInvite] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/events/notifications`,
      { withCredentials: true },
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as NotificationMessage

      if (data.type === 'INVITE_CREATED') {
        setHasNewInvite(true)

        toast(
          `Você recebeu um convite para a organização ${data.organizationName}`,
        )

        queryClient.invalidateQueries({
          queryKey: ['pending-invites'],
        })
      }
    }

    eventSource.onerror = () => {
      console.log('Erro na conexão SSE')
    }

    return () => {
      eventSource.close()
    }
  }, [queryClient])

  function clearNewInvite() {
    setHasNewInvite(false)
  }

  return (
    <NotificationsContext.Provider value={{ hasNewInvite, clearNewInvite }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider',
    )
  }

  return context
}
