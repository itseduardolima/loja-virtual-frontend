import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface StatusHistoryItem {
  id: number
  status: number
  created_at: string
}

interface OrderStatusHistoryResponse {
  data: StatusHistoryItem[]
}

export function useOrderStatusHistory(orderId: number | null, isVendor: boolean = true) {
  return useQuery<OrderStatusHistoryResponse>({
    queryKey: ['order-status-history', orderId, isVendor],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      
      const endpoint = isVendor 
        ? `/orders/${orderId}/status-history`
        : `/customers/orders/${orderId}/status-history`
      
      const response = await api.get(endpoint)
      return response.data
    },
    enabled: !!orderId,
  })
}


