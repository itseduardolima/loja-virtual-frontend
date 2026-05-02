import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { ChangePlanRequest, ChangePlanResponse } from '@/types/subscription'
import toast from 'react-hot-toast'

export function useChangePlan() {
  const queryClient = useQueryClient()

  return useMutation<ChangePlanResponse, Error, ChangePlanRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ChangePlanResponse>('/subscriptions/change-plan', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })

      if ('scheduled' in data && data.scheduled) {
        toast.success(data.message || 'Troca de plano agendada!')
        return
      }

      // Upgrade com proração: o plano novo só fica ativo após pagamento confirmado.
      // Não dizer "alterado com sucesso" — ainda está pendente.
      if ('payment_url' in data && data.payment_url) {
        toast.success(
          'Cobrança da diferença gerada. Pague para ativar o novo plano — abrindo link de pagamento...',
          { duration: 5000 },
        )
        window.open(data.payment_url, '_blank')
      } else {
        toast.success('Solicitação enviada.')
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao trocar de plano'
      toast.error(errorMessage)
    },
  })
}
