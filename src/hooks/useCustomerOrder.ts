import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CustomerOrder } from '@/types/customer'

export function useCustomerOrder(orderId: number) {
  return useQuery({
    queryKey: ['customer-order', orderId],
    queryFn: async (): Promise<CustomerOrder> => {
      const response = await api.get<CustomerOrder>(`/customers/orders/${orderId}`)
      return response.data
    },
    enabled: !!orderId,
    staleTime: 30000,
  })
}

