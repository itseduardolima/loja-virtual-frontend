import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface RefundSubscriptionResponse {
  message: string
}

export function useRefundSubscription() {
  const queryClient = useQueryClient()

  return useMutation<RefundSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.post<RefundSubscriptionResponse>('/subscriptions/refund')
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reembolso solicitado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar reembolso'
      toast.error(errorMessage)
    },
  })
}
