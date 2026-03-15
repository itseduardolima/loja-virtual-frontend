import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminSubscription, PaginatedResponse } from '@/types/admin'

export function useAdminSubscriptions(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'subscriptions', params],
    queryFn: async (): Promise<PaginatedResponse<AdminSubscription>> => {
      const res = await api.get('/admin/subscriptions', { params })
      return res.data
    },
  })
}
