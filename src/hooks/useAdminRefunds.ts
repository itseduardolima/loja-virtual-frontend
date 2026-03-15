import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminRefund, PaginatedResponse } from '@/types/admin'

export function useAdminRefunds(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'refunds', params],
    queryFn: async (): Promise<PaginatedResponse<AdminRefund>> => {
      const res = await api.get('/admin/refunds', { params })
      return res.data
    },
  })
}
