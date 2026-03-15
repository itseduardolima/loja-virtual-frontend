import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminStore, PaginatedResponse } from '@/types/admin'

export function useAdminStores(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'stores', params],
    queryFn: async (): Promise<PaginatedResponse<AdminStore>> => {
      const res = await api.get('/admin/stores', { params })
      return res.data
    },
  })
}

export function useAdminToggleStoreStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/stores/${id}/status`)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'stores'] }),
  })
}
