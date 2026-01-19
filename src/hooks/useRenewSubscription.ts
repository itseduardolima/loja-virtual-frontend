import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from '@/types/subscription'
import toast from 'react-hot-toast'

export function useRenewSubscription() {
  const queryClient = useQueryClient()

  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CreateSubscriptionResponse>('/subscriptions/renew', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Assinatura renovada com sucesso!')
      // Invalidar a query da assinatura para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
      
      // Se há URL de pagamento, abrir em nova aba
      if (data.payment_url) {
        window.open(data.payment_url, '_blank')
        toast.success('Redirecionando para pagamento...', { duration: 3000 })
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao renovar assinatura'
      toast.error(errorMessage)
    },
  })
}

