import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CustomerStatsResponse } from '@/types/customer'

export function useCustomerStats() {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: async (): Promise<CustomerStatsResponse> => {
      const response = await api.get<CustomerStatsResponse>('/customers/stats')
      return response.data
    },
    staleTime: 60000, // 1 minuto
  })
}

