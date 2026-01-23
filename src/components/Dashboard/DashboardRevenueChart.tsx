'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  data?: RevenueData[]
}

const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
} satisfies Record<string, { label: string; color: string }>

export function DashboardRevenueChart({ data: initialData }: DashboardRevenueChartProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month')

  const { data: revenueData = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: async (): Promise<RevenueData[]> => {
      const response = await api.get(`/dashboard/revenue?period=${period}`)
      return response.data.data || []
    },
    staleTime: 30000,
    enabled: true,
  })

  const data = revenueData.length > 0 ? revenueData : (initialData || [])

  const chartData = useMemo(() => {
    const formatPeriod = (period: string) => {
      if (period.includes('-')) {
        const [year, month] = period.split('-')
        return `${month}/${year}`
      }
      return period
    }

    return data.map(item => ({
      period: formatPeriod(item.period),
      receita: item.revenue,
    }))
  }, [data])

  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Receita por Período
        </CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Período:</label>
          <Select value={period} onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}>
            <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

