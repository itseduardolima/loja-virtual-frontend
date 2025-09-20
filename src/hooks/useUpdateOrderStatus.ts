import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from './useToast'

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: number }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['order-detail', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      toast({
        title: 'Status do pedido atualizado com sucesso!',
        description: 'Status do pedido atualizado com sucesso!',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status do pedido'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })
}
