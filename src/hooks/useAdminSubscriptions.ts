import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useSyncAdminSubscriptions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<{ migrated_plans: number; expired_subs: number }> => {
      const res = await api.post('/admin/subscriptions/sync')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscriptions'] })
    },
  })
}
