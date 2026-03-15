import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminPlan, PaginatedResponse } from '@/types/admin'

export function useAdminPlans(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'plans', params],
    queryFn: async (): Promise<PaginatedResponse<AdminPlan>> => {
      const res = await api.get('/admin/plans', { params })
      return res.data
    },
  })
}

export function useAdminCreatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<AdminPlan>) => {
      const res = await api.post('/admin/plans', data)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  })
}

export function useAdminUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdminPlan> }) => {
      const res = await api.patch(`/admin/plans/${id}`, data)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  })
}

export function useAdminDeletePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/admin/plans/${id}`)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  })
}
