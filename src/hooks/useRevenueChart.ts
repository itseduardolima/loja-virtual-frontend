import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardDateFilter, RevenueData } from './useDashboard'

interface UseRevenueChartOptions {
  enabled?: boolean
}

export function useRevenueChart(
  dateFilter?: DashboardDateFilter,
  options: UseRevenueChartOptions = {},
) {
  const { enabled = true } = options
  const params: Record<string, string> = {}
  if (dateFilter?.dateFrom) params.dateFrom = dateFilter.dateFrom
  if (dateFilter?.dateTo) params.dateTo = dateFilter.dateTo

  return useQuery({
    queryKey: ['dashboard', 'revenue', params],
    queryFn: async (): Promise<RevenueData[]> => {
      const response = await api.get('/dashboard/revenue', { params })
      return response.data.data ?? []
    },
    staleTime: 30_000,
    enabled,
  })
}
