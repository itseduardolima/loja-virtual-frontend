import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { BillingCycle, PlanCouponValidation } from '@/types/subscription'

interface ValidateParams {
  code: string
  plan_slug: string
  billing_cycle?: BillingCycle
}

export function useValidatePlanCoupon() {
  return useMutation({
    mutationFn: async (params: ValidateParams): Promise<PlanCouponValidation> => {
      const res = await api.post<PlanCouponValidation>('/subscriptions/validate-coupon', params)
      return res.data
    },
  })
}
