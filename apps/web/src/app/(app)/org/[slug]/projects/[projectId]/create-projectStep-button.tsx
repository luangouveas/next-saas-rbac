'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ProjectStepForm } from './projectStep-form'

interface CreateProjectStepButtonProps {
  projectSlug: string
}

export function CreateProjectStepButton({
  projectSlug,
}: CreateProjectStepButtonProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  function onSuccess() {
    toast('Successfully saved the project step')
    setModalOpen(false)
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Create Step
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Create Step
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-4">
            <ProjectStepForm projectSlug={projectSlug} onSuccess={onSuccess} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
