'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComparativeStats } from '@/hooks/useDashboard'

interface DashboardComparativeStatsProps {
  data?: ComparativeStats
}

const chartConfig = {
  atual: {
    label: 'Mês Atual',
    color: 'hsl(221.2 83.2% 53.3%)',
  },
  anterior: {
    label: 'Mês Anterior',
    color: 'hsl(210 40% 85%)',
  },
} satisfies Record<string, { label: string; color: string }>

export function DashboardComparativeStats({ data }: DashboardComparativeStatsProps) {
  if (!data) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Comparativo Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    {
      name: 'Receita',
      atual: data.revenue.current,
      anterior: data.revenue.previous,
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Comparativo Mensal
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Comparação entre mês atual e mês anterior
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pedidos */}
            <div className="rounded-lg border border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pedidos</span>
                {data.orders.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {data.orders.current}
                </span>
                <span className={cn(
                  'text-sm font-semibold',
                  data.orders.change > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {data.orders.change > 0 ? '+' : ''}{data.orders.change.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Mês anterior: {data.orders.previous}
              </p>
            </div>

            {/* Receita */}
            <div className="rounded-lg border border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Receita</span>
                {data.revenue.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(data.revenue.current)}
                </span>
                <span className={cn(
                  'text-sm font-semibold',
                  data.revenue.change > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {data.revenue.change > 0 ? '+' : ''}{data.revenue.change.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Mês anterior: {formatPrice(data.revenue.previous)}
              </p>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
                  return `R$ ${value}`
                }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-md">
                      <p className="font-semibold mb-2">{data.name}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-600">Mês Atual:</span>
                          <span className="text-sm font-semibold">
                            {data.name === 'Receita' 
                              ? formatPrice(data.atual)
                              : data.atual.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-600">Mês Anterior:</span>
                          <span className="text-sm font-semibold">
                            {data.name === 'Receita'
                              ? formatPrice(data.anterior)
                              : data.anterior.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar 
                dataKey="atual" 
                fill="var(--color-atual)"
                radius={[8, 8, 0, 0]}
                name="Mês Atual"
              />
              <Bar 
                dataKey="anterior" 
                fill="var(--color-anterior)"
                radius={[8, 8, 0, 0]}
                name="Mês Anterior"
              />
              <ChartLegend 
                content={<ChartLegendContent />}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

