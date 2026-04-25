import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { SubscriptionPlan } from '@/types/subscription'

export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await api.get<SubscriptionPlan[]>('/subscriptions/plans')
      return response.data
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
}
