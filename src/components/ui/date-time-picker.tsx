'use client'

import * as React from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value?: string | null
  onChange?: (value: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Selecionar data',
  className,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const parsed = value ? parseISO(value) : undefined
  const selectedDate = parsed && isValid(parsed) ? parsed : undefined

  const timeValue = selectedDate
    ? format(selectedDate, 'HH:mm')
    : '00:00'

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      onChange?.(null)
      return
    }
    const parts = timeValue.split(':').map(Number)
    const h = isNaN(parts[0]) ? 0 : parts[0]
    const m = isNaN(parts[1]) ? 0 : parts[1]
    const d = new Date(day)
    d.setHours(h, m, 0, 0)
    onChange?.(format(d, "yyyy-MM-dd'T'HH:mm"))
    setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    if (!selectedDate) return
    const [h, m] = time.split(':').map(Number)
    const updated = new Date(selectedDate)
    updated.setHours(h, m, 0, 0)
    onChange?.(format(updated, "yyyy-MM-dd'T'HH:mm"))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal h-10 text-sm border-gray-200 rounded-xl',
            !selectedDate && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
          {selectedDate
            ? format(selectedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDaySelect}
          locale={ptBR}
          initialFocus
        />
        <div className="border-t border-gray-100 p-3 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500">Horário</span>
          <Input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            disabled={!selectedDate}
            className="h-8 text-sm w-28 ml-auto"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
