import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ChangePlanRequest, BillingCycle } from '@/types/subscription'

export type PreviewChangePlanResponse =
  | {
      kind: 'upgrade'
      proration_amount: number
      days_remaining: number
      total_days: number
      old_plan: string
      new_plan: string
      current_price: number
      new_price: number
      next_full_charge_at: string
    }
  | {
      kind: 'downgrade' | 'cycle'
      effective_at: string
      new_plan: string
      new_cycle: BillingCycle
      new_price: number
    }

export function usePreviewChangePlan() {
  return useMutation<PreviewChangePlanResponse, Error, ChangePlanRequest>({
    mutationFn: async (data) => {
      const response = await api.post<PreviewChangePlanResponse>(
        '/subscriptions/preview-change-plan',
        data,
      )
      return response.data
    },
  })
}
