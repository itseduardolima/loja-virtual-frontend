import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Payment } from '@/types/subscription'

interface SubscriptionPaymentsResponse {
  data: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useSubscriptionPayments({
  page,
  limit = 10,
  enabled = true,
}: {
  page: number
  limit?: number
  enabled?: boolean
}) {
  return useQuery<SubscriptionPaymentsResponse>({
    queryKey: ['subscription-payments', page, limit],
    queryFn: async () => {
      const response = await api.get('/subscriptions/payments', {
        params: { page, limit },
      })
      return response.data
    },
    enabled,
    staleTime: 30 * 1000,
  })
}
