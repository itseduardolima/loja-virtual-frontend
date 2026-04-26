'use client'

import { useDashboardPage } from './useDashboardPage'
import { DashboardDateRangeFilter } from '../../../components/Dashboard/DashboardDateRangeFilter'
import { DashboardStatsCard } from '@/components/Dashboard/DashboardStatsCard'
import { DashboardRevenueChart } from '@/components/Dashboard/DashboardRevenueChart'
import { DashboardRecentOrders } from '@/components/Dashboard/DashboardRecentOrders'
import { DashboardTopProducts } from '@/components/Dashboard/DashboardTopProducts'
import { DashboardCartConversion } from '@/components/Dashboard/DashboardCartConversion'
import { AlertTriangle, BarChart3, FileText, Tag } from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'
import { LockedFeatureOverlay } from '@/components/Layout/LockedFeatureOverlay'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'

export default function DashboardPage() {
  const { features } = usePlanFeatures()
  const {
    summary,
    recentOrders,
    topProducts,
    isLoading,
    isError,
    dateFilter,
    dateFromInput,
    dateToInput,
    onRangeSelect,
    hasDateFilter,
    isViewingToday,
    revenueValue,
  } = useDashboardPage()

  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Erro ao carregar dashboard
          </h2>
          <p className="text-muted-foreground">
            Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header + Filtro por período */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Acompanhe suas vendas, pedidos e produtos em tempo real
          </p>
          {isViewingToday && (
            <p className="text-xs text-blue-600 font-medium mt-1">
              Visualizando dados de hoje.
            </p>
          )}
        </div>
        <DashboardDateRangeFilter
          dateFromInput={dateFromInput}
          dateToInput={dateToInput}
          hasDateFilter={hasDateFilter}
          onRangeSelect={onRangeSelect}
        />
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashboardStatsCard
          title="Vendas Totais"
          value={revenueValue}
          icon={BarChart3}
          variant="pink"
        />
        <DashboardStatsCard
          title="Total de Pedidos"
          value={summary?.today?.orders || 0}
          icon={FileText}
          variant="orange"
        />
        <DashboardStatsCard
          title="Produtos Vendidos"
          value={summary?.today?.products_sold || 0}
          icon={Tag}
          variant="green"
        />
        <DashboardCartConversion data={summary?.cart_conversion} />
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div>
          <DashboardRecentOrders orders={recentOrders} hasDateFilter={hasDateFilter} isViewingToday={isViewingToday} />
        </div>
        <LockedFeatureOverlay feature="feature_advanced_dashboard" locked={!features.feature_advanced_dashboard}>
          <DashboardTopProducts products={topProducts} hasDateFilter={hasDateFilter} isViewingToday={isViewingToday} />
        </LockedFeatureOverlay>
      </div>

      {/* Gráfico de Receita */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        <LockedFeatureOverlay feature="feature_advanced_dashboard" locked={!features.feature_advanced_dashboard}>
          <DashboardRevenueChart
            dateFrom={dateFilter?.dateFrom}
            dateTo={dateFilter?.dateTo}
            enabled={features.feature_advanced_dashboard}
          />
        </LockedFeatureOverlay>
      </div>
    </div>
  )
}
