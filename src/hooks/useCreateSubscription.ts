import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from '@/types/subscription'

export function useCreateSubscription() {
  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CreateSubscriptionResponse>('/subscriptions', data)
      return response.data
    },
  })
}

