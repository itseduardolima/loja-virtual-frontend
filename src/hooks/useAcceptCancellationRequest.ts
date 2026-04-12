import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from './useToast'

export function useAcceptCancellationRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api.patch(`/orders/${orderId}/cancel-request/accept`)
      return response.data
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast({ title: 'Cancelamento aceito', description: 'O pedido foi cancelado com sucesso.', variant: 'success' })
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.response?.data?.message || 'Erro ao aceitar cancelamento', variant: 'destructive' })
    },
  })
}
