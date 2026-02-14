'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DashboardDateRangeFilterProps {
  dateFromInput: string
  dateToInput: string
  hasDateFilter: boolean
  onRangeSelect: (range: { dateFrom: string; dateTo: string } | null) => void
  onQuickRange: (days: number) => void
  onClear: () => void
  className?: string
}

export function DashboardDateRangeFilter({
  dateFromInput,
  dateToInput,
  hasDateFilter,
  onRangeSelect,
  onClear,
  className,
}: DashboardDateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  /** Range em seleção: só aplicamos o filtro quando from e to estiverem definidos */
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(undefined)

  const selectedRange: DateRange | undefined = React.useMemo(() => {
    if (!dateFromInput) return undefined
    const from = new Date(dateFromInput + 'T12:00:00')
    if (!dateToInput) return { from }
    const to = new Date(dateToInput + 'T12:00:00')
    return { from, to }
  }, [dateFromInput, dateToInput])

  React.useEffect(() => {
    if (open) setPendingRange(selectedRange)
  }, [open])

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setPendingRange(undefined)
      onRangeSelect(null)
      return
    }
    setPendingRange(range)
    // Não aplica nem fecha aqui — o filtro só é aplicado ao clicar em "Aplicar" ou nos atalhos (7/30/90 dias).
  }

  const applyRange = (from: Date, to: Date) => {
    onRangeSelect({
      dateFrom: format(from, 'yyyy-MM-dd'),
      dateTo: format(to, 'yyyy-MM-dd'),
    })
    setOpen(false)
  }

  /** Atalho: só preenche o intervalo no calendário; o usuário precisa clicar em Aplicar para filtrar. */
  const setQuickRangeInCalendar = (days: number) => {
    const to = new Date()
    const from = new Date(to)
    from.setDate(from.getDate() - days)
    setPendingRange({ from, to })
  }

  const label =
    dateFromInput && dateToInput
      ? `${format(new Date(dateFromInput + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(dateToInput + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}`
      : 'Selecionar período'

  return (
    <div className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-12 justify-start text-left font-normal min-w-[200px] sm:min-w-[240px] rounded-xl relative pr-9',
              !dateFromInput && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-4 h-5 w-5 shrink-0" />
            <span className="flex-1 truncate text-left">{label}</span>
            {hasDateFilter && (
              <button
                type="button"
                aria-label="Limpar período"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClear()
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={pendingRange?.from ?? selectedRange?.from ?? new Date()}
            selected={pendingRange ?? selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-t">
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setQuickRangeInCalendar(7)}
              >
                7 dias
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setQuickRangeInCalendar(30)}
              >
                30 dias
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setQuickRangeInCalendar(90)}
              >
                90 dias
              </Button>
            </div>
            {pendingRange?.from != null && (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  const from = pendingRange.from as Date
                  const to = pendingRange.to ?? from
                  applyRange(from, to)
                }}
              >
                Aplicar
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
