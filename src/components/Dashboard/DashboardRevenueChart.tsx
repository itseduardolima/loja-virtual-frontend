'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { formatPrice } from '@/lib/utils'

interface RevenueData {
  period: string
  revenue: number
}

interface DashboardRevenueChartProps {
  dateFrom?: string
  dateTo?: string
  enabled?: boolean
}

const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
} satisfies Record<string, { label: string; color: string }>

function formatPeriodLabel(period: string): string {
  const parts = period.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`   // YYYY-MM-DD → DD/MM
  if (parts.length === 2) return `${parts[1]}/${parts[0]}`   // YYYY-MM → MM/YYYY
  return period
}

export function DashboardRevenueChart({ dateFrom, dateTo, enabled = true }: DashboardRevenueChartProps) {
  const params = new URLSearchParams()
  if (dateFrom) params.set('dateFrom', dateFrom)
  if (dateTo) params.set('dateTo', dateTo)

  const { data: revenueData = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'revenue', 'auto', dateFrom, dateTo],
    queryFn: async (): Promise<RevenueData[]> => {
      const response = await api.get(`/dashboard/revenue?${params.toString()}`)
      return response.data.data || []
    },
    staleTime: 30000,
    enabled,
  })

  const chartData = useMemo(() => {
    return revenueData.map(item => ({
      period: formatPeriodLabel(item.period),
      receita: item.revenue,
    }))
  }, [revenueData])

  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Receita por Período
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 md:pt-10">
        {isLoading ? (
          <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
            <p className="text-sm sm:text-base text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
                  return `R$ ${value.toFixed(0)}`
                }}
                width={60}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => formatPrice(value as number)} />}
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="var(--color-receita)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

