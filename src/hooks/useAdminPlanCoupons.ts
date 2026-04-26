import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminPlanCoupon, PaginatedResponse } from '@/types/admin'

function invalidatePlanCouponCaches(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['admin', 'plan-coupons'] })
  qc.invalidateQueries({ queryKey: ['plan-coupon-validation'] })
}

export function useAdminPlanCoupons(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'plan-coupons', params],
    queryFn: async (): Promise<PaginatedResponse<AdminPlanCoupon>> => {
      const res = await api.get('/admin/plan-coupons', { params })
      return res.data
    },
  })
}

export function useAdminPlanCoupon(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'plan-coupons', id],
    queryFn: async (): Promise<AdminPlanCoupon> => {
      const res = await api.get(`/admin/plan-coupons/${id}`)
      return res.data
    },
    enabled: id != null,
  })
}

export function useAdminCreatePlanCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<AdminPlanCoupon> & { plan_ids?: number[] }) => {
      const res = await api.post('/admin/plan-coupons', data)
      return res.data
    },
    onSuccess: () => invalidatePlanCouponCaches(qc),
  })
}

export function useAdminUpdatePlanCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdminPlanCoupon> & { plan_ids?: number[] } }) => {
      const res = await api.patch(`/admin/plan-coupons/${id}`, data)
      return res.data
    },
    onSuccess: () => invalidatePlanCouponCaches(qc),
  })
}

export function useAdminDeletePlanCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/admin/plan-coupons/${id}`)
      return res.data
    },
    onSuccess: () => invalidatePlanCouponCaches(qc),
  })
}
