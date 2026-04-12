import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CancelOrderDto, CancelOrderResponse } from '@/types/customer'
import toast from 'react-hot-toast'
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: number; data: CancelOrderDto }): Promise<CancelOrderResponse> => {
      const response = await api.patch<CancelOrderResponse>(`/customers/orders/${orderId}/cancel`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] })
      queryClient.invalidateQueries({ queryKey: ['customer-order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao cancelar pedido'
      toast.error(message)
    },
  })
}

