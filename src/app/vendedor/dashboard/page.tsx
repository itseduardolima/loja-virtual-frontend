'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardStatsCard } from '@/components/Dashboard/DashboardStatsCard'
import { DashboardRevenueChart } from '@/components/Dashboard/DashboardRevenueChart'
import { DashboardRecentOrders } from '@/components/Dashboard/DashboardRecentOrders'
import { DashboardTopProducts } from '@/components/Dashboard/DashboardTopProducts'
import { DashboardComparativeStats } from '@/components/Dashboard/DashboardComparativeStats'
import {
  AlertTriangle,
  BarChart3,
  FileText,
  Tag,
  Users,
} from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function DashboardPage() {
  const { summary, recentOrders, topProducts, comparativeStats, isLoading, isError } = useDashboard()

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
    <div className="max-w-7xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe suas vendas, pedidos e produtos em tempo real
          </p>
        </div>

        {/* Cards de Estatísticas - Today's Sales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatsCard
            title="Vendas Totais"
            value={(() => {
              const revenue = summary?.today?.revenue || 0
              if (revenue >= 1000000) {
                return `R$ ${(revenue / 1000000).toFixed(1)}M`
              }
              if (revenue >= 1000) {
                return `R$ ${(revenue / 1000).toFixed(1)}k`
              }
              return `R$ ${revenue.toFixed(0)}`
            })()}
            subtitle="Resumo de Vendas"
            icon={BarChart3}
            variant="pink"
            trend={summary?.today?.revenue_growth ? {
              value: summary.today.revenue_growth,
              label: 'de ontem'
            } : undefined}
          />
          <DashboardStatsCard
            title="Total de Pedidos"
            value={summary?.today?.orders || 0}
            subtitle="Resumo de Pedidos"
            icon={FileText}
            variant="orange"
            trend={summary?.today?.orders_growth ? {
              value: summary.today.orders_growth,
              label: 'de ontem'
            } : undefined}
          />
          <DashboardStatsCard
            title="Produtos Vendidos"
            value={summary?.today?.products_sold || 0}
            subtitle="Resumo de Produtos"
            icon={Tag}
            variant="green"
            trend={summary?.today?.products_growth ? {
              value: summary.today.products_growth,
              label: 'de ontem'
            } : undefined}
          />
          <DashboardStatsCard
            title="Novos Clientes"
            value={summary?.today?.new_customers || 0}
            subtitle="Resumo de Clientes"
            icon={Users}
            variant="purple"
            trend={summary?.today?.customers_growth ? {
              value: summary.today.customers_growth,
              label: 'de ontem'
            } : undefined}
          />
        </div>

        {/* Gráficos e Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pedidos Recentes */}
          <div className="lg:col-span-2">
            <DashboardRecentOrders orders={recentOrders} />
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="lg:col-span-1">
            <DashboardTopProducts products={topProducts} />
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardRevenueChart />
          <DashboardComparativeStats data={comparativeStats} />
        </div>
    </div>
  )
}

