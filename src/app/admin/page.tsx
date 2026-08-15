'use client'

import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Wallet,
  RefreshCw,
  AlertCircle,
  BarChart3 as BarChart3Icon,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatBRL } from '@/lib/utils'
import { useAdminPage } from './useAdminPage'

function formatCompactBRL(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`
  }
  return formatBRL(value)
}

function Sk({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)}
      style={style}
    />
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  variant = 'primary',
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  variant?: 'primary' | 'success'
}) {
  const iconBg =
    variant === 'success'
      ? 'bg-[rgba(63,138,102,0.10)]'
      : 'bg-[rgba(42,45,124,0.08)]'
  const iconColor = variant === 'success' ? 'text-nxs' : 'text-nxp'

  return (
    <div className="rounded-2xl border border-nxborder bg-white p-[18px] shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <span
        className={cn(
          'flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px]',
          iconBg,
        )}
      >
        <Icon size={17} className={iconColor} />
      </span>
      <div className="mt-[14px] text-[11px] font-bold uppercase tracking-[.04em] text-nxi3">
        {label}
      </div>
      <div className="mt-0.5 text-[25px] font-black leading-tight tracking-[-0.03em] text-nxi1">
        {value}
      </div>
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-nxborder bg-white p-[18px] shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <Sk className="h-[34px] w-[34px] rounded-[10px]" />
      <Sk className="mt-[14px] h-[11px] w-4/5" />
      <Sk className="mt-2 h-6 w-[55%]" />
    </div>
  )
}

function KpiError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-2 md:col-span-5 flex flex-wrap items-center gap-4 rounded-2xl border border-nxborder bg-white p-[18px] shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-[rgba(193,58,46,0.08)]">
        <AlertCircle size={22} className="text-[#C13A2E]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold text-nxi1">
          Não foi possível carregar as métricas
        </p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-nxi2">
          Erro ao buscar os dados da plataforma.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex shrink-0 items-center gap-[7px] rounded-[9px] bg-nxp px-4 h-[38px] text-[13px] font-bold text-white"
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  )
}

function ChartError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[rgba(193,58,46,0.08)]">
        <AlertCircle size={24} className="text-[#C13A2E]" />
      </span>
      <p className="mt-3 text-[14px] font-extrabold text-nxi1">Erro ao carregar o gráfico</p>
      <p className="mt-1 text-[12.5px] font-semibold text-nxi2">
        Não conseguimos buscar os dados de receita.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-[14px] flex items-center gap-[7px] rounded-[9px] border border-nxborder bg-white px-4 h-[38px] text-[13px] font-bold text-nxi2"
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  )
}

function ChartEmpty() {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-nxbg">
        <BarChart3Icon size={24} className="text-nxi3" />
      </span>
      <p className="mt-3 text-[14px] font-extrabold text-nxi1">Sem dados no período</p>
      <p className="mt-1 max-w-[300px] text-[12.5px] font-semibold text-nxi2">
        Ainda não há receita registrada nos últimos 6 meses. Os dados aparecem assim que as lojas
        venderem.
      </p>
    </div>
  )
}

function BarValueLabel({
  x,
  y,
  width,
  value,
  index,
  total,
}: {
  x?: number
  y?: number
  width?: number
  value?: number
  index?: number
  total?: number
}) {
  if (value == null || x == null || y == null || width == null) return null
  const compact =
    value >= 1_000
      ? `${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
      : String(value)
  const isLast = index != null && total != null && index === total - 1
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fill={isLast ? '#2A2D7C' : '#4B4E62'}
      fontSize={11}
      fontWeight={isLast ? 900 : 800}
      fontFamily="Nunito, sans-serif"
    >
      {compact}
    </text>
  )
}

export default function AdminPage() {
  const {
    stats,
    loadingStats,
    isErrorStats,
    refetchStats,
    loadingRevenue,
    isErrorRevenue,
    refetchRevenue,
    chartData,
  } = useAdminPage()

  const countFmt = (n: number) => n.toLocaleString('pt-BR')

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Visão geral</h1>
        <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
          Acompanhe o desempenho da plataforma em tempo real.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {loadingStats ? (
          Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : isErrorStats ? (
          <KpiError onRetry={() => refetchStats()} />
        ) : (
          <>
            <KpiCard
              icon={Users}
              label="Total de usuários"
              value={countFmt(stats?.total_users ?? 0)}
              variant="primary"
            />
            <KpiCard
              icon={Store}
              label="Vendedores ativos"
              value={countFmt(stats?.total_sellers ?? 0)}
              variant="primary"
            />
            <KpiCard
              icon={ShoppingBag}
              label="Lojas ativas"
              value={countFmt(stats?.active_stores ?? 0)}
              variant="primary"
            />
            <KpiCard
              icon={TrendingUp}
              label="Receita do mês"
              value={formatCompactBRL(stats?.monthly_revenue ?? 0)}
              variant="success"
            />
            <KpiCard
              icon={Wallet}
              label="Receita total"
              value={formatCompactBRL(stats?.total_revenue ?? 0)}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl border border-nxborder bg-white p-[22px] shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        {loadingRevenue ? (
          <>
            <Sk className="h-[15px] w-1/2" />
            <Sk className="mt-2 h-3 w-[35%]" />
            <div className="mt-6 flex items-end gap-[18px] h-[180px]">
              {[52, 60, 67, 75, 87, 100].map((h, i) => (
                <Sk
                  key={i}
                  className="flex-1"
                  style={{ height: `${h}%`, borderRadius: '8px 8px 0 0' }}
                />
              ))}
            </div>
          </>
        ) : isErrorRevenue ? (
          <>
            <p className="text-[15px] font-extrabold tracking-[-0.01em] text-nxi1">
              Receita dos últimos 6 meses
            </p>
            <ChartError onRetry={() => refetchRevenue()} />
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-extrabold tracking-[-0.01em] text-nxi1">
                  Receita dos últimos 6 meses
                </p>
                <p className="mt-0.5 text-[12.5px] font-semibold text-nxi3">
                  Soma das vendas de todas as lojas
                </p>
              </div>
            </div>
            {chartData.length === 0 ? (
              <ChartEmpty />
            ) : (
              <div className="mt-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barCategoryGap="30%">
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        fill: '#8A8CA3',
                        fontFamily: 'Nunito, sans-serif',
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v: number) => [formatBRL(v), 'Receita']}
                      contentStyle={{
                        borderRadius: 10,
                        border: '1px solid #E6E7EE',
                        fontSize: 12,
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                      labelStyle={{ fontWeight: 800, color: '#1C1E2B' }}
                      cursor={{ fill: 'rgba(42,45,124,0.04)' }}
                    />
                    <Bar
                      dataKey="receita"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={46}
                      label={(props: any) => (
                        <BarValueLabel {...props} total={chartData.length} />
                      )}
                    >
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === chartData.length - 1
                              ? '#2A2D7C'
                              : 'rgba(42,45,124,0.16)'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
