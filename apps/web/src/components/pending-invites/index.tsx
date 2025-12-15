'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BellIcon, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useNotifications } from '@/app/providers/notifications-provider'
import { getPendingInvites } from '@/http/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const { hasNewInvite, clearNewInvite } = useNotifications()

  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string, slug: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })

    router.push(`/org/${slug}`)
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          clearNewInvite()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          aria-label="Notifications"
          className="relative"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {hasNewInvite && (
            <span className="absolute right-[4px] top-1 h-2 w-2 animate-ping rounded-full bg-red-300" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending Invites ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">No invites found.</p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div key={invite.id} className="space-y-2 border-b pb-2">
              <div className="flex flex-col space-y-0">
                <span className="text-sm font-medium text-foreground">
                  {invite.organization.name}
                </span>
                <span className="text-xs italic text-muted-foreground">
                  {invite.author?.name ?? 'Someone'}{' '}
                  {dayjs(invite.createdAt).fromNow()}
                </span>
              </div>

              <div className="flex gap-1">
                <Button
                  onClick={() =>
                    handleAcceptInvite(invite.id, invite.organization.slug)
                  }
                  size="xs"
                  variant="outline"
                >
                  <Check className="mr-1.5 size-3" />
                  Accept
                </Button>

                <Button
                  onClick={() => handleRejectInvite(invite.id)}
                  size="xs"
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <X className="mr-1.5 size-3" />
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
