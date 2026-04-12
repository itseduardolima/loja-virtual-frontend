import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface TrackOrderStatusHistory {
  id: number
  status: number
  status_text: string
  created_at: string
}

export interface TrackOrderData {
  id: number
  order_code: string
  order_number: string
  status: number
  status_text: string
  status_description: string
  total: string
  created_at: string
  updated_at: string
  customer_name: string
  store: {
    id: number
    name: string
    logo?: string | null
  }
  history?: TrackOrderStatusHistory[]
}

export interface TrackOrderResponse {
  data: TrackOrderData
}

export function useTrackOrder(code: string | null) {
  return useQuery<TrackOrderResponse>({
    queryKey: ['track-order', code],
    queryFn: async () => {
      const response = await api.get<TrackOrderResponse>(`/catalog/track/${code}`)
      return response.data
    },
    enabled: !!code,
    retry: false,
    staleTime: 30000,
  })
}
