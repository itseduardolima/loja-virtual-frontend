'use client'

import { Users, Store, BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { DashboardStatsCard } from '@/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAdminPage } from './useAdminPage'

export default function AdminPage() {
  const { stats, loadingStats, loadingRevenue, formatCurrency, chartData } = useAdminPage()

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardStatsCard
          title="Total de Usuários"
          value={loadingStats ? '...' : stats?.total_users ?? 0}
          icon={Users}
          variant="pink"
        />
        <DashboardStatsCard
          title="Vendedores Ativos"
          value={loadingStats ? '...' : stats?.total_sellers ?? 0}
          icon={TrendingUp}
          variant="orange"
        />
        <DashboardStatsCard
          title="Lojas Ativas"
          value={loadingStats ? '...' : stats?.active_stores ?? 0}
          icon={Store}
          variant="green"
        />
        <DashboardStatsCard
          title="Receita do Mês"
          value={loadingStats ? '...' : formatCurrency(stats?.monthly_revenue ?? 0)}
          icon={DollarSign}
          variant="purple"
        />
        <DashboardStatsCard
          title="Receita Total"
          value={loadingStats ? '...' : formatCurrency(stats?.total_revenue ?? 0)}
          icon={BarChart3}
          variant="pink"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Receita dos últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRevenue ? (
            <div className="h-64 flex items-center justify-center text-gray-400">Carregando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${v}`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="receita" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
