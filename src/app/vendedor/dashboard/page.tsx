'use client'

import { ErrorState } from '@/components/Layout/ErrorState'
import { LockedFeatureOverlay } from '@/components/Layout/LockedFeatureOverlay'
import {
  DashboardHeader,
  DashboardKpiGrid,
  DashboardRecentOrders,
  DashboardRevenueChart,
  DashboardTopProducts,
} from '@/components/Vendor/Dashboard'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useStore } from '@/hooks/useStore'
import { useDashboardPage } from './useDashboardPage'

export default function DashboardPage() {
  const { features } = usePlanFeatures()
  const { data: store } = useStore()
  const {
    summary,
    recentOrders,
    topProducts,
    revenueData,
    previousRevenueData,
    isLoading,
    isError,
    period,
    setPeriod,
    customRange,
    setCustomRange,
  } = useDashboardPage()

  if (isError) {
    return <ErrorState message="Erro ao carregar dashboard" fullScreen={false} />
  }

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader
        period={period}
        onPeriodChange={setPeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        storeName={store?.name}
      />

      <DashboardKpiGrid summary={summary} isLoading={isLoading} period={period} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <LockedFeatureOverlay
          feature="feature_advanced_dashboard"
          locked={!features.feature_advanced_dashboard}
        >
          <DashboardRevenueChart
            data={revenueData}
            previousData={previousRevenueData}
            total={summary?.comparison?.revenue?.current ?? summary?.today?.revenue ?? 0}
            isLoading={isLoading}
            hasLifetimeSales={(summary?.revenue?.total ?? 0) > 0}
          />
        </LockedFeatureOverlay>

        <div className="flex flex-col gap-4">
          <LockedFeatureOverlay
            feature="feature_advanced_dashboard"
            locked={!features.feature_advanced_dashboard}
          >
            <DashboardTopProducts products={topProducts} isLoading={isLoading} />
          </LockedFeatureOverlay>
          <DashboardRecentOrders orders={recentOrders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
