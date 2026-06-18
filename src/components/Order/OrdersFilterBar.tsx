'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  List,
  LayoutGrid,
  Download,
  Loader2,
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  Check,
  Calendar as CalendarIcon,
  Lock,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  STATUS_SEGMENTS,
  SORT_LABELS,
  SORT_OPTIONS,
  type OrderSortKey,
  type OrderViewMode,
  type StatusFilter,
} from '@/lib/orderVendorMeta'

interface OrdersFilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  onClearSearch: () => void
  sortKey: OrderSortKey
  onSortChange: (k: OrderSortKey) => void
  dateRange: { from: string; to: string } | null
  onRangeChange: (range: { from: string; to: string } | null) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (k: StatusFilter) => void
  counts: Record<'all' | 1 | 2 | 3 | 4 | 5, number>
}

// ─── Toggle Lista ↔ Quadro (C1) ────────────────────────────────────────────────
const TOGGLE_BTN =
  'flex h-[32px] items-center gap-[6px] rounded-[8px] px-[14px] text-[13px] font-extrabold transition-colors'

export function OrderViewToggle({
  view,
  onChange,
}: {
  view: OrderViewMode
  onChange: (v: OrderViewMode) => void
}): JSX.Element {
  const isList = view === 'list'
  return (
    <div className="flex rounded-[11px] border border-nxborder bg-white p-[3px]">
      <button
        type="button"
        onClick={() => onChange('list')}
        className={cn(TOGGLE_BTN, isList ? 'bg-[#EEF0FB] text-nxp' : 'text-nxi3')}
      >
        <List size={15} className={isList ? 'text-nxp' : 'text-nxi3'} />
        Lista
      </button>
      <button
        type="button"
        onClick={() => onChange('board')}
        className={cn(TOGGLE_BTN, !isList ? 'bg-[#EEF0FB] text-nxp' : 'text-nxi3')}
      >
        <LayoutGrid size={15} className={!isList ? 'text-nxp' : 'text-nxi3'} />
        Quadro
      </button>
    </div>
  )
}

// ─── Exportar Excel (C5 · 3 estados) ───────────────────────────────────────────
export function OrderExportButton({
  onExport,
  exporting = false,
  locked = false,
}: {
  onExport: () => void
  exporting?: boolean
  locked?: boolean
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onExport}
      className={cn(
        'flex h-[38px] items-center gap-[7px] rounded-[11px] border border-nxborder px-[14px] text-[13px] font-bold transition-colors',
        locked ? 'bg-[#F6F6F9] text-[#9A9CAB]' : 'bg-white text-nxi2',
      )}
    >
      {exporting ? (
        <>
          <Loader2 size={15} className="animate-spin text-nxi3" />
          Exportando…
        </>
      ) : locked ? (
        <>
          <Lock size={15} className="text-[#9A9CAB]" />
          Exportar Excel
          <span className="ml-[4px] rounded-[6px] bg-[#EEF0FB] px-[7px] py-[1px] text-[10.5px] font-extrabold text-nxp">
            Plano Pro
          </span>
        </>
      ) : (
        <>
          <Download size={15} className="text-nxi3" />
          Exportar Excel
        </>
      )}
    </button>
  )
}

// ─── Barra de filtros (busca + ordenação + período + segments) ──────────────────
export function OrdersFilterBar({
  search,
  onSearchChange,
  onClearSearch,
  sortKey,
  onSortChange,
  dateRange,
  onRangeChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: OrdersFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(undefined)

  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (!dateRange) return undefined
    return {
      from: new Date(dateRange.from + 'T12:00:00'),
      to: new Date(dateRange.to + 'T12:00:00'),
    }
  }, [dateRange])

  // Sincroniza o range pendente ao abrir o calendário.
  useEffect(() => {
    if (periodOpen) setPendingRange(selectedRange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodOpen])

  const periodActive = !!dateRange
  const periodLabel = dateRange
    ? `${format(new Date(dateRange.from + 'T12:00:00'), 'dd/MM', { locale: ptBR })} – ${format(new Date(dateRange.to + 'T12:00:00'), 'dd/MM', { locale: ptBR })}`
    : 'Período'

  const applyRange = (from: Date, to: Date) => {
    onRangeChange({ from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') })
    setPeriodOpen(false)
  }

  const quickRange = (days: number) => {
    const to = new Date()
    const from = new Date(to)
    from.setDate(from.getDate() - days)
    applyRange(from, to)
  }

  // Fecha o menu de ordenação ao clicar fora.
  useEffect(() => {
    if (!sortOpen) return
    function onPointerDown(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [sortOpen])

  return (
    <div>
      {/* Linha 1 — busca + ordenação + período */}
      <div className="flex flex-wrap items-center gap-[10px]">
        {/* Busca (C2) */}
        <div className="relative min-w-[220px] max-w-[340px] flex-1">
          <span className="absolute left-[12px] top-1/2 -translate-y-1/2">
            <Search size={16} className="text-nxi3" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código ou cliente…"
            className="h-[40px] w-full rounded-[11px] border border-nxborder bg-white pl-[36px] pr-[34px] text-[13px] font-semibold text-nxi1 outline-none placeholder:text-nxi3 focus:border-nxp focus:shadow-[0_0_0_3px_rgba(42,45,124,0.1)]"
          />
          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Limpar busca"
              className="absolute right-[8px] top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-[6px] bg-[#EEF0F4]"
            >
              <X size={13} className="text-nxi3" />
            </button>
          )}
        </div>

        {/* Ordenação (C3) */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex h-[40px] items-center gap-[7px] rounded-[11px] border border-nxborder bg-white px-[13px] text-[13px] font-bold text-nxi2"
          >
            <ArrowUpDown size={15} className="text-nxi3" />
            {SORT_LABELS[sortKey]}
            <ChevronDown size={14} className="text-nxi3" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-[46px] z-30 w-[208px] rounded-[13px] border border-nxborder bg-white p-[6px] shadow-[0_16px_40px_-16px_rgba(28,30,43,0.4)]">
              {SORT_OPTIONS.map((key) => {
                const active = sortKey === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSortChange(key)
                      setSortOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-[8px] px-[10px] py-[8px] text-[12.5px]',
                      active ? 'bg-[#EEF0FB] font-extrabold text-nxp' : 'font-semibold text-nxi2',
                    )}
                  >
                    {SORT_LABELS[key]}
                    {active && <Check size={15} className="text-nxp" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Período (C4) — calendário de range */}
        <div className="relative">
          <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex h-[40px] items-center gap-[7px] rounded-[11px] border px-[13px] text-[13px] font-bold',
                  periodActive
                    ? 'border-nxp bg-[#EEF0FB] pr-[34px] text-nxp'
                    : 'border-nxborder bg-white text-nxi2',
                )}
              >
                <CalendarIcon size={15} className={periodActive ? 'text-nxp' : 'text-nxi3'} />
                {periodLabel}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-auto max-w-[calc(100vw-1rem)] rounded-[14px] p-0"
            >
              <Calendar
                mode="range"
                defaultMonth={pendingRange?.from ?? selectedRange?.from ?? new Date()}
                selected={pendingRange ?? selectedRange}
                onSelect={setPendingRange}
                numberOfMonths={2}
                locale={ptBR}
                classNames={{
                  day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-middle)]:bg-[#EEF0FB] [&:has([aria-selected].day-outside)]:bg-[#EEF0FB]/50 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md',
                  day_button:
                    'h-9 w-9 p-0 font-normal rounded-md hover:bg-[#EEF0FB] hover:text-nxp aria-selected:opacity-100',
                  range_start: 'day-range-start bg-nxp text-white rounded-l-md',
                  range_end: 'day-range-end bg-nxp text-white rounded-r-md',
                  range_middle: 'aria-selected:bg-[#EEF0FB] aria-selected:text-nxp',
                  today: '[&>button]:bg-[#EEF0FB] [&>button]:text-nxp rounded-md',
                  selected: '',
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-[8px] border-t border-nxborder p-[8px]">
                <div className="flex gap-[4px]">
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => quickRange(d)}
                      className="h-[32px] rounded-[8px] px-[10px] text-[12px] font-bold text-nxi2 transition-colors hover:bg-[#EEF0FB] hover:text-nxp"
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                {pendingRange?.from && (
                  <button
                    type="button"
                    onClick={() =>
                      applyRange(
                        pendingRange.from as Date,
                        pendingRange.to ?? (pendingRange.from as Date),
                      )
                    }
                    className="h-[32px] rounded-[8px] bg-nxp px-[14px] text-[12px] font-extrabold text-white"
                  >
                    Aplicar
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          {periodActive && (
            <button
              type="button"
              aria-label="Limpar período"
              onClick={() => onRangeChange(null)}
              className="absolute right-[10px] top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center rounded-[5px] hover:bg-white/60"
            >
              <X size={14} className="text-nxp" />
            </button>
          )}
        </div>
      </div>

      {/* Linha 2 — segments de status (C6) */}
      <div className="mt-[13px] flex flex-wrap gap-[7px]">
        {STATUS_SEGMENTS.map((seg) => {
          const active = statusFilter === seg.key
          return (
            <button
              key={String(seg.key)}
              type="button"
              onClick={() => onStatusFilterChange(seg.key)}
              className={cn(
                'flex h-[32px] items-center gap-[7px] whitespace-nowrap rounded-[9px] border px-[11px] text-[12.5px] font-bold',
                active ? 'border-nxp bg-nxp text-white' : 'border-nxborder bg-white text-nxi2',
              )}
            >
              {!active && seg.dot && (
                <span className={cn('h-[7px] w-[7px] rounded-full', seg.dot)} />
              )}
              {seg.label}
              <span
                className={cn(
                  'flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-[5px] text-[10.5px] font-extrabold',
                  active ? 'bg-white/[0.22] text-white' : 'bg-[#EEF0F4] text-nxi3',
                )}
              >
                {counts[seg.key]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
