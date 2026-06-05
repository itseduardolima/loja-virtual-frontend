'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, Receipt, ShoppingBag, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { useDashboard, type DashboardComparison } from '@/hooks/useDashboard'
import { useOnboardingChecklist } from '@/hooks/useOnboardingChecklist'
import { usePendingQuestionsCount } from '@/hooks/usePendingQuestionsCount'
import { LoadingPage } from '@/components/Layout'
import { Checklist, HomeGreeting, KpiCard, StoreCard } from '@/components'
import {
  formatBRL,
  formatTodayLabel,
  getGreeting,
  kpiDeltaProps,
  type DeltaSource,
} from '@/lib/vendor'

function ticketAverageDelta(cmp?: DashboardComparison): DeltaSource | undefined {
  if (!cmp) return undefined
  const cur = cmp.orders.current > 0 ? cmp.revenue.current / cmp.orders.current : 0
  const prev = cmp.orders.previous > 0 ? cmp.revenue.previous / cmp.orders.previous : 0
  const delta = cur - prev
  const dir: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  return { delta, dir }
}

export default function VendedorPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: store, isLoading: storeLoading } = useStore()
  const { summary, isLoading: dashLoading } = useDashboard()
  const { data: pendingQuestionsCount = 0 } = usePendingQuestionsCount()
  const { items: checkItems } = useOnboardingChecklist()

  useEffect(() => {
    if (!authLoading && !storeLoading && user?.profile === 'Vendedor' && !store) {
      router.push('/vendedor/criar-loja')
    }
  }, [authLoading, storeLoading, user, store, router])

  const ticketDelta = useMemo(() => ticketAverageDelta(summary?.comparison), [summary])

  if (authLoading || storeLoading || !store) return <LoadingPage />

  const greeting = getGreeting(user?.name ?? '')
  const todayLabel = formatTodayLabel()

  const pendingOrders = summary?.orders?.pending ?? 0
  const todayRevenue = summary?.today?.revenue ?? 0
  const todayOrders = summary?.today?.orders ?? 0
  const ticketAvg = todayOrders > 0 ? todayRevenue / todayOrders : 0
  const conversionRate = summary?.cart_conversion?.conversion_rate ?? 0
  const hasConversionData = (summary?.cart_conversion?.total_sessions ?? 0) > 0
  const conversionValue = hasConversionData
    ? `${conversionRate.toFixed(1).replace('.', ',')}%`
    : '—'

  const cmp = summary?.comparison
  const revenueProps = kpiDeltaProps(cmp?.revenue, 'currency')
  const ordersProps = kpiDeltaProps(cmp?.orders, 'count', 'pedido')
  const ticketProps = kpiDeltaProps(ticketDelta, 'currency')
  const conversionProps = hasConversionData
    ? kpiDeltaProps(cmp?.conversion, 'percentPoints')
    : { delta: undefined, deltaDir: 'up' as const }

  return (
    <div className="flex flex-col gap-5">
      <HomeGreeting
        greetingText={greeting.text}
        period={greeting.period}
        todayLabel={todayLabel}
        pendingOrders={pendingOrders}
        pendingQuestions={pendingQuestionsCount}
        isLoading={dashLoading}
      />

      <div className="grid grid-cols-[1fr_360px] items-start gap-4">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-4 gap-3">
            <KpiCard
              label="Receita hoje"
              value={formatBRL(todayRevenue)}
              icon={TrendingUp}
              tone="primary"
              {...revenueProps}
            />
            <KpiCard
              label="Pedidos hoje"
              value={String(todayOrders)}
              icon={ShoppingBag}
              tone="accent"
              {...ordersProps}
            />
            <KpiCard
              label="Ticket médio"
              value={formatBRL(ticketAvg)}
              icon={Receipt}
              tone="warning"
              {...ticketProps}
            />
            <KpiCard
              label="Conversão do carrinho"
              value={conversionValue}
              icon={BarChart2}
              tone="success"
              {...conversionProps}
            />
          </div>

          <Checklist items={checkItems} />
        </div>

        <StoreCard />
      </div>
    </div>
  )
}
