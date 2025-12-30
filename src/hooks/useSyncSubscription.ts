import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Subscription } from '@/types/subscription'

interface SyncSubscriptionResponse {
  data: Subscription
}

export function useSyncSubscription() {
  const queryClient = useQueryClient()

  return useMutation<Subscription, Error, void>({
    mutationFn: async () => {
      const response = await api.post<SyncSubscriptionResponse>('/subscriptions/sync')
      return response.data.data
    },
    onSuccess: () => {
      // Invalida a query da assinatura para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
  })
}

