'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import type { RevenueData } from '@/hooks/useDashboard'
import { formatBRL } from '@/lib/vendor'

interface DashboardRevenueChartProps {
  data: RevenueData[]
  previousData?: RevenueData[]
  total: number
  isLoading: boolean
  hasLifetimeSales?: boolean
}

interface ChartPoint {
  period: string
  label: string
  receita: number
  anterior: number | null
}

function formatXTick(period: string): string {
  if (period.length === 10) {
    const [, month, day] = period.split('-')
    return `${day}/${month}`
  }
  if (period.length === 7) {
    const [year, month] = period.split('-')
    return `${month}/${year.slice(2)}`
  }
  return period
}

function formatYTick(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')}k`
  return `R$ ${Math.round(value)}`
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload as ChartPoint | undefined
  if (!point) return null
  return (
    <div className="min-w-[160px] rounded-[10px] border border-nxborder bg-white px-2.5 py-2 shadow-[0_8px_24px_hsl(0_0%_0%/0.08)]">
      <div className="mb-1 font-mono text-[11px] text-nxi3">{formatXTick(point.period)}</div>
      <div className="text-[14px] font-bold tracking-[-0.015em] text-nxi1">
        {formatBRL(point.receita)}
      </div>
      {point.anterior !== null && (
        <div className="mt-0.5 text-[11.5px] text-nxi2">Anterior: {formatBRL(point.anterior)}</div>
      )}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-1 py-2">
      <div className="h-3.5 w-32 animate-pulse rounded bg-nxbg" />
      <div className="h-7 w-44 animate-pulse rounded bg-nxbg" />
      <div className="mt-2 h-[240px] w-full animate-pulse rounded-xl bg-nxbg" />
    </div>
  )
}

function ChartEmptyArt() {
  return (
    <svg
      width="180"
      height="100"
      viewBox="0 0 180 100"
      fill="none"
      className="mb-3 text-nxi3/60"
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="178"
        height="98"
        rx="10"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M16 80 L48 60 L82 70 L116 40 L150 50 L164 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="48" cy="60" r="3" fill="currentColor" />
      <circle cx="82" cy="70" r="3" fill="currentColor" />
      <circle cx="116" cy="40" r="3" fill="currentColor" />
      <circle cx="150" cy="50" r="3" fill="currentColor" />
    </svg>
  )
}

function ChartEmpty({ hasLifetimeSales }: { hasLifetimeSales: boolean }) {
  if (hasLifetimeSales) {
    return (
      <div className="flex flex-col items-center gap-2 px-8 py-14 text-center">
        <ChartEmptyArt />
        <h3 className="m-0 text-[18px] font-bold tracking-[-0.01em] text-nxi1">
          Nenhuma venda neste período
        </h3>
        <p className="m-0 max-w-[360px] text-[13.5px] text-nxi2">
          Tente ampliar o intervalo (7d, 30d ou 90d) para ver a evolução da sua receita.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 px-8 py-14 text-center">
      <ChartEmptyArt />
      <h3 className="m-0 text-[18px] font-bold tracking-[-0.01em] text-nxi1">
        Sua primeira venda está chegando
      </h3>
      <p className="m-0 max-w-[340px] text-[13.5px] text-nxi2">
        Quando os pedidos começarem a entrar, você verá aqui o gráfico de receita do período.
      </p>
      <Link
        href="/vendedor/produtos/criar"
        className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-nxa px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Package size={15} />
        Cadastrar primeiro produto
      </Link>
    </div>
  )
}

export function DashboardRevenueChart({
  data,
  previousData,
  total,
  isLoading,
  hasLifetimeSales = false,
}: DashboardRevenueChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    return data.map((point, index) => ({
      period: point.period,
      label: formatXTick(point.period),
      receita: point.revenue,
      anterior: previousData?.[index]?.revenue ?? null,
    }))
  }, [data, previousData])

  const allZero = chartData.length > 0 && chartData.every((p) => p.receita === 0)
  const isEmpty = !isLoading && (chartData.length === 0 || allZero)

  return (
    <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-nxi1">Receita</h3>
          {!isLoading && !isEmpty && (
            <span className="mt-1 inline-block text-[28px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-nxi1">
              {formatBRL(total)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[12px] text-nxi2">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-nxp" />
            Período atual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-nxi3/50" />
            Anterior
          </span>
        </div>
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : isEmpty ? (
        <ChartEmpty hasLifetimeSales={hasLifetimeSales} />
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(237 49% 33%)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="hsl(237 49% 33%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ECEEF3" strokeDasharray="3 4" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10.5, fill: '#8A93A8', fontFamily: 'JetBrains Mono, monospace' }}
                interval={chartData.length > 14 ? Math.floor(chartData.length / 8) : 0}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={formatYTick}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10.5, fill: '#8A93A8', fontFamily: 'JetBrains Mono, monospace' }}
                width={56}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: 'hsl(237 49% 33%)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                  opacity: 0.4,
                }}
              />
              {previousData && previousData.length > 0 && (
                <Area
                  type="monotone"
                  dataKey="anterior"
                  stroke="hsl(225 10% 58%)"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="transparent"
                  isAnimationActive={false}
                />
              )}
              <Area
                type="monotone"
                dataKey="receita"
                stroke="hsl(237 49% 33%)"
                strokeWidth={2}
                fill="url(#rev-grad)"
                activeDot={{ r: 5, stroke: 'hsl(237 49% 33%)', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
