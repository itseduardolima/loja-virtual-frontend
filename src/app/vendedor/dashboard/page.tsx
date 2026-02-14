'use client'

import { useDashboardPage } from './useDashboardPage'
import { DashboardDateRangeFilter } from './DashboardDateRangeFilter'
import { DashboardStatsCard } from '@/components/Dashboard/DashboardStatsCard'
import { DashboardRevenueChart } from '@/components/Dashboard/DashboardRevenueChart'
import { DashboardRecentOrders } from '@/components/Dashboard/DashboardRecentOrders'
import { DashboardTopProducts } from '@/components/Dashboard/DashboardTopProducts'
import { DashboardComparativeStats } from '@/components/Dashboard/DashboardComparativeStats'
import { AlertTriangle, BarChart3, FileText, Tag, Users } from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function DashboardPage() {
  const {
    summary,
    recentOrders,
    topProducts,
    comparativeStats,
    isLoading,
    isError,
    dateFilter,
    dateFromInput,
    dateToInput,
    onRangeSelect,
    clearFilter,
    setQuickRange,
    hasDateFilter,
    revenueValue,
    revenueTrend,
    ordersTrend,
    productsTrend,
    customersTrend,
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
    <div className="max-w-7xl mx-auto sm:px-4 md:px-6 lg:px-8 sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header + Filtro por período */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Acompanhe suas vendas, pedidos e produtos em tempo real
          </p>
        </div>
        <DashboardDateRangeFilter
          dateFromInput={dateFromInput}
          dateToInput={dateToInput}
          hasDateFilter={hasDateFilter}
          onRangeSelect={onRangeSelect}
          onQuickRange={setQuickRange}
          onClear={clearFilter}
        />
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashboardStatsCard
          title="Vendas Totais"
          value={revenueValue}
          subtitle="Resumo de Vendas"
          icon={BarChart3}
          variant="pink"
          trend={revenueTrend}
        />
        <DashboardStatsCard
          title="Total de Pedidos"
          value={summary?.today?.orders || 0}
          subtitle="Resumo de Pedidos"
          icon={FileText}
          variant="orange"
          trend={ordersTrend}
        />
        <DashboardStatsCard
          title="Produtos Vendidos"
          value={summary?.today?.products_sold || 0}
          subtitle="Resumo de Produtos"
          icon={Tag}
          variant="green"
          trend={productsTrend}
        />
        <DashboardStatsCard
          title="Novos Clientes"
          value={summary?.today?.new_customers || 0}
          subtitle="Resumo de Clientes"
          icon={Users}
          variant="purple"
          trend={customersTrend}
        />
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <DashboardRecentOrders orders={recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <DashboardTopProducts products={topProducts} />
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <DashboardRevenueChart dateFrom={dateFilter?.dateFrom} dateTo={dateFilter?.dateTo} />
        <DashboardComparativeStats data={comparativeStats} />
      </div>
    </div>
  )
}
