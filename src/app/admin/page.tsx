'use client'

import { Users, Store, BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { DashboardStatsCard } from '@/components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAdminPage } from './useAdminPage'
import { SectionCard, SectionHeader } from './_shared'

export default function AdminPage() {
  const { stats, loadingStats, loadingRevenue, formatCurrency, chartData } = useAdminPage()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
          Painel Administrativo
        </h1>
        <p className="mt-0.5 text-[13px] text-nxi2">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <DashboardStatsCard
          title="Total de Usuários"
          value={loadingStats ? '—' : stats?.total_users ?? 0}
          icon={Users}
          variant="primary"
        />
        <DashboardStatsCard
          title="Vendedores Ativos"
          value={loadingStats ? '—' : stats?.total_sellers ?? 0}
          icon={TrendingUp}
          variant="accent"
        />
        <DashboardStatsCard
          title="Lojas Ativas"
          value={loadingStats ? '—' : stats?.active_stores ?? 0}
          icon={Store}
          variant="success"
        />
        <DashboardStatsCard
          title="Receita do Mês"
          value={loadingStats ? '—' : formatCurrency(stats?.monthly_revenue ?? 0)}
          icon={DollarSign}
          variant="warning"
        />
        <DashboardStatsCard
          title="Receita Total"
          value={loadingStats ? '—' : formatCurrency(stats?.total_revenue ?? 0)}
          icon={BarChart3}
          variant="primary"
        />
      </div>

      <SectionCard>
        <SectionHeader
          title="Receita dos últimos 6 meses"
          description="Faturamento mensal consolidado"
        />
        {loadingRevenue ? (
          <div className="flex h-64 items-center justify-center text-[13px] text-nxi3">
            Carregando…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--nxborder))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="receita" fill="hsl(var(--nxp))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </SectionCard>
    </div>
  )
}
