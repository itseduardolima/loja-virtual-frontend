import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Order } from '@/types/order'

export function useOrderDetail(orderId: number) {
  return useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: async (): Promise<Order> => {
      const response = await api.get<Order>(`/orders/${orderId}`)
      return response.data
    },
    enabled: !!orderId,
    staleTime: 30000, // 30 segundos
  })
}
