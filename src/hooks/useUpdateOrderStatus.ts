import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from './useToast'

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ orderId, status, cancellation_reason }: { orderId: number; status: number; cancellation_reason?: string }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status, cancellation_reason })
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
    onError: (error: any, variables) => {
      // A UI já aplicou a mudança de status otimisticamente (applyOptimisticStatus em
      // useOrdersPage) antes da mutation rodar. Se ela falhar, o cache fica com o status
      // errado até o próximo refetch natural (staleTime 30s) — invalida na hora para não
      // deixar o vendedor vendo um status que o backend rejeitou.
      queryClient.invalidateQueries({ queryKey: ['order-detail', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })

      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status do pedido'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })
}
