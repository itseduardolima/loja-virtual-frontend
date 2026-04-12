import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { OrdersResponse, OrdersFilters } from '@/types/order'

export function useOrders(filters: OrdersFilters = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sort = 'DATE_DESC',
    date_from,
    date_to,
    unread,
  } = filters

  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams()

      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (status) params.append('status', status.toString())
      if (search) params.append('search', search)
      if (sort) params.append('sort', sort)
      if (date_from) params.append('date_from', date_from)
      if (date_to) params.append('date_to', date_to)
      if (unread) params.append('unread', 'true')

      const response = await api.get<OrdersResponse>('/orders', {
        params: Object.fromEntries(params)
      })
      
      return response.data
    },
    staleTime: 30000, // 30 segundos
  })
}
