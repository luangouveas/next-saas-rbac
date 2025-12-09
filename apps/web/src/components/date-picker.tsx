'use client'

import { CalendarIcon } from 'lucide-react'
import {
  Button,
  DatePicker,
  Dialog,
  Group,
  Label,
  Popover,
} from 'react-aria-components'

import { Calendar } from '@/components/ui/calendar-rac'
import { DateInput } from '@/components/ui/datefield-rac'

interface DatePickerComponentPorps {
  label?: string
  name: string
}

export default function DatePickerComponent({
  label,
  name,
}: DatePickerComponentPorps) {
  return (
    <DatePicker className="*:not-first:mt-2" name={name}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}
      <div className="flex">
        <Group className="w-full">
          <DateInput className="pe-9" />
        </Group>
        <Button className="data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground">
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className="outline-hidden data-entering:animate-in data-exiting:animate-out z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-2">
          <Calendar />
        </Dialog>
      </Popover>
    </DatePicker>
  )
}
