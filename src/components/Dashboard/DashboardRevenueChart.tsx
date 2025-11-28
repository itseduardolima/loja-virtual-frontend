'use client'

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
  data: RevenueData[]
  period?: 'day' | 'week' | 'month'
}

const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
} satisfies Record<string, { label: string; color: string }>

export function DashboardRevenueChart({ data, period = 'month' }: DashboardRevenueChartProps) {
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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Receita por Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
      </CardContent>
    </Card>
  )
}

