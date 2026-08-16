import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AdminPlan, PaginatedResponse } from '@/types/admin'

function invalidateAllPlanCaches(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['admin', 'plans'] })
  qc.invalidateQueries({ queryKey: ['subscription', 'plans'] })
  qc.invalidateQueries({ queryKey: ['subscription', 'plan'] })
  qc.invalidateQueries({ queryKey: ['subscription', 'me'] })
  // Features dependentes de plano podem mudar — invalida caches que dependem de feature flags
  qc.invalidateQueries({ queryKey: ['dashboard'] })
  // Cupons de plano: usar a queryKey real de useAdminPlanCoupons
  qc.invalidateQueries({ queryKey: ['admin', 'plan-coupons'] })
}

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
    onSuccess: () => invalidateAllPlanCaches(qc),
  })
}

export function useAdminUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdminPlan> }) => {
      const res = await api.patch(`/admin/plans/${id}`, data)
      return res.data
    },
    onSuccess: () => invalidateAllPlanCaches(qc),
  })
}

export function useAdminDeletePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/admin/plans/${id}`)
      return res.data
    },
    onSuccess: () => invalidateAllPlanCaches(qc),
  })
}
