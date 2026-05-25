'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DashboardRangeValue, PeriodKey } from './types'

interface DashboardPeriodChipsProps {
  value: PeriodKey
  onChange: (value: PeriodKey) => void
  customRange: DashboardRangeValue | null
  onCustomRangeChange: (range: DashboardRangeValue | null) => void
}

const PRESET_CHIPS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
]

function formatShort(date: string) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

export function DashboardPeriodChips({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: DashboardPeriodChipsProps) {
  const [open, setOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState(customRange?.from ?? '')
  const [draftTo, setDraftTo] = useState(customRange?.to ?? '')

  // Quando o popover reabre ou o range externo muda, sincroniza os drafts.
  useEffect(() => {
    if (open) {
      setDraftFrom(customRange?.from ?? '')
      setDraftTo(customRange?.to ?? '')
    }
  }, [open, customRange])

  const customLabel =
    value === 'custom' && customRange
      ? `${formatShort(customRange.from)} – ${formatShort(customRange.to)}`
      : 'Custom'

  function handleApply() {
    if (draftFrom && draftTo && draftFrom <= draftTo) {
      onCustomRangeChange({ from: draftFrom, to: draftTo })
      setOpen(false)
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Período"
      className="inline-flex items-center rounded-xl border border-nxborder bg-white p-1 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]"
    >
      {PRESET_CHIPS.map((chip) => {
        const active = value === chip.key
        return (
          <button
            key={chip.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(chip.key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold tabular-nums transition-colors',
              active
                ? 'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)]'
                : 'text-nxi2 hover:text-nxi1',
            )}
          >
            {chip.label}
          </button>
        )
      })}

      <span aria-hidden className="mx-1 h-[18px] w-px bg-nxborder" />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="tab"
            aria-selected={value === 'custom'}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold tabular-nums transition-colors',
              value === 'custom'
                ? 'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)]'
                : 'text-nxi2 hover:text-nxi1',
            )}
          >
            <Calendar size={12} />
            {customLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 rounded-xl border-nxborder p-4">
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-semibold text-nxi1">Período personalizado</h4>
            <label className="flex flex-col gap-1 text-[11.5px] font-medium text-nxi2">
              De
              <input
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                className="rounded-lg border border-nxborder bg-white px-2 py-1.5 text-[13px] text-nxi1 focus:border-nxp focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11.5px] font-medium text-nxi2">
              Até
              <input
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                className="rounded-lg border border-nxborder bg-white px-2 py-1.5 text-[13px] text-nxi1 focus:border-nxp focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleApply}
              disabled={!draftFrom || !draftTo || draftFrom > draftTo}
              className="mt-1 rounded-lg bg-nxp px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
