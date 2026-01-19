import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface CancelSubscriptionResponse {
  message: string
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation<CancelSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.delete<CancelSubscriptionResponse>('/subscriptions')
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Assinatura cancelada com sucesso')
      // Invalidar a query da assinatura para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao cancelar assinatura'
      toast.error(errorMessage)
    },
  })
}

