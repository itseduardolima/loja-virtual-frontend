'use client'

import { useCallback, useMemo, useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useRevenueChart } from '@/hooks/useRevenueChart'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useStore } from '@/hooks/useStore'
import { useAuth } from '@/contexts/AuthContext'
import { getPreviousRange } from '@/lib/vendor'
import type { PeriodKey } from '@/components/Vendor/Dashboard'

export interface DashboardCustomRange {
  from: string
  to: string
}

const todayIso = () => new Date().toISOString().slice(0, 10)
const isoFromOffset = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function rangeForPeriod(
  period: PeriodKey,
  customRange: DashboardCustomRange | null,
): DashboardCustomRange | null {
  switch (period) {
    case 'today':
      return { from: todayIso(), to: todayIso() }
    case '7d':
      return { from: isoFromOffset(6), to: todayIso() }
    case '30d':
      return { from: isoFromOffset(29), to: todayIso() }
    case '90d':
      return { from: isoFromOffset(89), to: todayIso() }
    case 'custom':
      return customRange
    default:
      return { from: isoFromOffset(6), to: todayIso() }
  }
}

export function useDashboardPage() {
  const { isLoading: authLoading } = useAuth()
  const { features } = usePlanFeatures()
  const { data: store, isLoading: storeLoading } = useStore()
  const [period, setPeriodState] = useState<PeriodKey>('7d')
  const [customRange, setCustomRangeState] = useState<DashboardCustomRange | null>(null)

  const currentRange = useMemo(() => rangeForPeriod(period, customRange), [period, customRange])
  const previousRange = useMemo(
    () => (currentRange ? getPreviousRange(currentRange.from, currentRange.to) : null),
    [currentRange],
  )

  const dateFilter = useMemo(
    () => (currentRange ? { dateFrom: currentRange.from, dateTo: currentRange.to } : undefined),
    [currentRange],
  )
  const previousFilter = useMemo(
    () => (previousRange ? { dateFrom: previousRange.from, dateTo: previousRange.to } : undefined),
    [previousRange],
  )

  const {
    summary,
    recentOrders,
    topProducts,
    isLoading: isLoadingCurrent,
    isError,
  } = useDashboard(dateFilter, { enableAdvanced: features.feature_advanced_dashboard })

  const revenueQuery = useRevenueChart(dateFilter, {
    enabled: features.feature_advanced_dashboard,
  })
  const previousRevenueQuery = useRevenueChart(previousFilter, {
    enabled: features.feature_advanced_dashboard && !!previousFilter,
  })

  const setPeriod = useCallback((next: PeriodKey) => {
    setPeriodState(next)
  }, [])

  const setCustomRange = useCallback((range: DashboardCustomRange | null) => {
    setCustomRangeState(range)
    if (range) setPeriodState('custom')
  }, [])

  return {
    summary,
    recentOrders,
    topProducts,
    revenueData: revenueQuery.data ?? [],
    previousRevenueData: previousRevenueQuery.data ?? [],
    isLoading: isLoadingCurrent,
    isInitializing: authLoading || storeLoading,
    isError,
    period,
    setPeriod,
    customRange,
    setCustomRange,
    currentRange,
    storeName: store?.name,
    advancedDashboard: features.feature_advanced_dashboard,
  }
}
