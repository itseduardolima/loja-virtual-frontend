'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardStatsCard } from '@/components/Dashboard/DashboardStatsCard'
import { DashboardRevenueChart } from '@/components/Dashboard/DashboardRevenueChart'
import { DashboardRecentOrders } from '@/components/Dashboard/DashboardRecentOrders'
import { DashboardTopProducts } from '@/components/Dashboard/DashboardTopProducts'
import { formatPrice } from '@/lib/utils'
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import LoadingPage from '@/components/LoadingPage'

export default function DashboardPage() {
  const { summary, recentOrders, topProducts, revenue, isLoading, isError } = useDashboard('month')

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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe suas vendas, pedidos e produtos em tempo real
          </p>
        </div>

        {/* Cards de Estatísticas - Hoje, Semana, Mês */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatsCard
            title="Receita Hoje"
            value={formatPrice(summary?.today.revenue || 0)}
            subtitle={`${summary?.today.orders || 0} pedidos`}
            icon={DollarSign}
            variant="success"
          />
          <DashboardStatsCard
            title="Receita Semanal"
            value={formatPrice(summary?.week.revenue || 0)}
            subtitle={`${summary?.week.orders || 0} pedidos`}
            icon={TrendingUp}
            variant="default"
          />
          <DashboardStatsCard
            title="Receita Mensal"
            value={formatPrice(summary?.month.revenue || 0)}
            subtitle={`${summary?.month.orders || 0} pedidos`}
            icon={DollarSign}
            variant="success"
          />
          <DashboardStatsCard
            title="Total de Receita"
            value={formatPrice(summary?.revenue.total || 0)}
            subtitle="Todas as vendas"
            icon={TrendingUp}
            variant="default"
          />
        </div>

        {/* Cards de Estatísticas - Produtos e Pedidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatsCard
            title="Total de Produtos"
            value={summary?.products.total || 0}
            subtitle="No catálogo"
            icon={Package}
            variant="default"
          />
          <DashboardStatsCard
            title="Estoque Baixo"
            value={summary?.products.low_stock || 0}
            subtitle="Produtos com estoque baixo"
            icon={AlertTriangle}
            variant={summary && summary.products.low_stock > 0 ? 'warning' : 'default'}
          />
          <DashboardStatsCard
            title="Pedidos Pendentes"
            value={summary?.orders.pending || 0}
            subtitle={`de ${summary?.orders.total || 0} total`}
            icon={Clock}
            variant={summary && summary.orders.pending > 0 ? 'warning' : 'default'}
          />
          <DashboardStatsCard
            title="Total de Pedidos"
            value={summary?.orders.total || 0}
            subtitle="Todos os pedidos"
            icon={ShoppingCart}
            variant="default"
          />
        </div>

        {/* Gráficos e Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Receita */}
          <div className="lg:col-span-1">
            <DashboardRevenueChart data={revenue} period="month" />
          </div>

          {/* Pedidos Recentes */}
          <div className="lg:col-span-1">
            <DashboardRecentOrders orders={recentOrders} />
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="grid grid-cols-1 lg:grid-cols-1">
          <DashboardTopProducts products={topProducts} />
        </div>
      </div>
    </div>
  )
}

