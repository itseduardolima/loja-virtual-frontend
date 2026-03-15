import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface AdminRevenueItem {
  month: string
  revenue: number
}

export function useAdminRevenue(months = 6) {
  return useQuery({
    queryKey: ['admin', 'revenue', months],
    queryFn: async (): Promise<AdminRevenueItem[]> => {
      const res = await api.get('/admin/revenue', { params: { months } })
      return res.data
    },
    staleTime: 30000,
  })
}
