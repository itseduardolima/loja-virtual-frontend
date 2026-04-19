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
  className?: string
  compact?: boolean
}

export function DashboardDateRangeFilter({
  dateFromInput,
  dateToInput,
  hasDateFilter,
  onRangeSelect,
  className,
  compact = false,
}: DashboardDateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  /** Range em seleção: só aplicamos o filtro quando from e to estiverem definidos */
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(undefined)
  const [activeQuickDays, setActiveQuickDays] = React.useState<number | null>(null)

  const selectedRange: DateRange | undefined = React.useMemo(() => {
    if (!dateFromInput) return undefined
    const from = new Date(dateFromInput + 'T12:00:00')
    if (!dateToInput) return { from }
    const to = new Date(dateToInput + 'T12:00:00')
    return { from, to }
  }, [dateFromInput, dateToInput])

  React.useEffect(() => {
    if (open) {
      setPendingRange(selectedRange)
      // Detecta se o range atual corresponde a um atalho (7/30/90 dias)
      if (selectedRange?.from && selectedRange?.to) {
        const diffMs = selectedRange.to.getTime() - selectedRange.from.getTime()
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
        const match = [7, 30, 90].find((d) => diffDays === d - 1) ?? null
        setActiveQuickDays(match)
      } else {
        setActiveQuickDays(null)
      }
    }
  }, [open])

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setPendingRange(undefined)
      setActiveQuickDays(null)
      onRangeSelect(null)
      return
    }
    setPendingRange(range)
    setActiveQuickDays(null)
    // Não aplica nem fecha aqui — o filtro só é aplicado ao clicar em "Aplicar" ou nos atalhos (7/30/90 dias).
  }

  const applyRange = (from: Date, to: Date) => {
    onRangeSelect({
      dateFrom: format(from, 'yyyy-MM-dd'),
      dateTo: format(to, 'yyyy-MM-dd'),
    })
    setOpen(false)
  }

  const setQuickRangeInCalendar = (days: number) => {
    const to = new Date()
    const from = new Date(to)
    from.setDate(from.getDate() - days)
    setPendingRange({ from, to })
    setActiveQuickDays(days)
    applyRange(from, to)
  }

  const datePattern = compact ? 'dd/MM' : 'dd/MM/yyyy'
  const label =
    dateFromInput && dateToInput
      ? `${format(new Date(dateFromInput + 'T12:00:00'), datePattern, { locale: ptBR })} - ${format(new Date(dateToInput + 'T12:00:00'), datePattern, { locale: ptBR })}`
      : compact ? 'Período' : 'Selecionar período'

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', compact ? 'w-auto' : 'w-full sm:w-auto', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal rounded-xl relative pr-9',
              compact ? 'h-10 flex-1' : 'h-10 sm:h-12 w-full sm:w-auto sm:min-w-[240px]',
              !dateFromInput && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className={cn('shrink-0', compact ? 'mr-1.5 h-4 w-4' : 'mr-2 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5')} />
            <span className="flex-1 truncate text-left text-sm">{label}</span>
            {hasDateFilter && (
              <button
                type="button"
                aria-label="Limpar período"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRangeSelect(null)
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto max-w-[calc(100vw-1rem)] p-0"
          align={isMobile ? 'center' : 'end'}
          sideOffset={8}
        >
          <Calendar
            mode="range"
            defaultMonth={pendingRange?.from ?? selectedRange?.from ?? new Date()}
            selected={pendingRange ?? selectedRange}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            locale={ptBR}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-t">
            <div className="flex gap-1">
              {[7, 30, 90].map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant={activeQuickDays === days ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setQuickRangeInCalendar(days)}
                >
                  {days}d
                </Button>
              ))}
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
