'use client'

import { DashboardPeriodChips } from './DashboardPeriodChips'
import type { DashboardRangeValue, PeriodKey } from './types'

interface DashboardHeaderProps {
  period: PeriodKey
  onPeriodChange: (value: PeriodKey) => void
  customRange: DashboardRangeValue | null
  onCustomRangeChange: (range: DashboardRangeValue | null) => void
  storeName?: string
}

export function DashboardHeader({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  storeName,
}: DashboardHeaderProps) {
  const description = storeName
    ? `Acompanhe vendas, pedidos e desempenho.`
    : 'Acompanhe vendas, pedidos e desempenho da sua loja.'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-nxi1">
          Dashboard
        </h1>
        <p className="mt-1 text-[13.5px] leading-[1.5] text-nxi2">{description}</p>
      </div>
      <DashboardPeriodChips
        value={period}
        onChange={onPeriodChange}
        customRange={customRange}
        onCustomRangeChange={onCustomRangeChange}
      />
    </div>
  )
}
