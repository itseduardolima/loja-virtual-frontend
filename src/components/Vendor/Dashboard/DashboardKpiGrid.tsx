'use client'

import { Coins, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { KpiCard } from '@/components/Vendor/Home'
import type { DashboardSummary } from '@/hooks/useDashboard'
import { formatBRL, kpiDeltaProps } from '@/lib/vendor'
import type { PeriodKey } from './types'

interface DashboardKpiGridProps {
  summary?: DashboardSummary
  isLoading: boolean
  period: PeriodKey
}

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-nxborder bg-white px-4 pt-4 pb-3.5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-nxbg" />
        <div className="h-7 w-7 animate-pulse rounded-lg bg-nxbg" />
      </div>
      <div className="h-7 w-32 animate-pulse rounded bg-nxbg" />
      <div className="h-3 w-20 animate-pulse rounded bg-nxbg" />
    </div>
  )
}

export function DashboardKpiGrid({ summary, isLoading, period }: DashboardKpiGridProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
    )
  }

  const cmp = summary.comparison
  const periodRevenue = cmp?.revenue.current ?? summary.today?.revenue ?? 0
  const periodOrders = cmp?.orders.current ?? summary.today?.orders ?? 0
  const periodProducts = cmp?.products_sold.current ?? summary.today?.products_sold ?? 0
  const periodConversion = cmp?.conversion.current ?? summary.cart_conversion?.conversion_rate ?? 0
  const hasConversionData = (summary.cart_conversion?.total_sessions ?? 0) > 0
  const conversionValue = hasConversionData
    ? `${periodConversion.toFixed(1).replace('.', ',')}%`
    : '—'
  const deltaLabel = period === 'today' ? 'vs ontem' : 'vs período anterior'

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        label="Vendas"
        value={formatBRL(periodRevenue)}
        icon={Coins}
        tone="primary"
        deltaLabel={deltaLabel}
        {...kpiDeltaProps(cmp?.revenue, 'currency')}
      />
      <KpiCard
        label="Pedidos"
        value={String(periodOrders)}
        icon={ShoppingCart}
        tone="accent"
        deltaLabel={deltaLabel}
        {...kpiDeltaProps(cmp?.orders, 'count', 'pedido')}
      />
      <KpiCard
        label="Produtos vendidos"
        value={String(periodProducts)}
        icon={Package}
        tone="warning"
        deltaLabel={deltaLabel}
        {...kpiDeltaProps(cmp?.products_sold, 'count', 'produto')}
      />
      <KpiCard
        label="Conversão de carrinho"
        value={conversionValue}
        icon={TrendingUp}
        tone="success"
        deltaLabel={deltaLabel}
        {...(hasConversionData
          ? kpiDeltaProps(cmp?.conversion, 'percentPoints')
          : { delta: undefined, deltaDir: 'up' as const })}
      />
    </div>
  )
}
