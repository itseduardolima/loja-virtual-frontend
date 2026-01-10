import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { OrderStatusResponse } from '@/types/customer'

export function useOrderStatus(orderCode: string) {
  return useQuery({
    queryKey: ['order-status', orderCode],
    queryFn: async (): Promise<OrderStatusResponse> => {
      const response = await api.get<OrderStatusResponse>(`/customers/orders/status/${orderCode}`)
      return response.data
    },
    enabled: !!orderCode,
    staleTime: 30000,
  })
}

