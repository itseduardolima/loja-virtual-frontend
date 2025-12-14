'use client'

import { useState } from 'react'
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

  const formatPeriod = (period: string) => {
    if (period.includes('-')) {
      const [year, month] = period.split('-')
      return `${month}/${year}`
    }
    return period
  }

  const chartData = data.map(item => ({
    period: formatPeriod(item.period),
    receita: item.revenue,
  }))

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Receita por Período
        </CardTitle>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Período:</label>
          <Select value={period} onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}>
            <SelectTrigger className="w-[140px]">
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
      <CardContent className="pt-10">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
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

