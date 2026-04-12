import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface StoreInfo {
  id: number
  name: string
  description: string | null
  logo: string | null
  whatsapp: string | null
  instagram: string | null
  facebook: string | null
  email: string | null
  phone: string | null
  address: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipcode: string | null
  slug: string
}

interface StoreInfoResponse {
  data: StoreInfo
  message: string
}

export function useStoreInfoById(storeId: number | null | undefined) {
  return useQuery<StoreInfoResponse>({
    queryKey: ['store-info', storeId],
    queryFn: async () => {
      if (!storeId) {
        throw new Error('Store ID is required')
      }
      const response = await api.get<StoreInfoResponse>(`/customers/store/${storeId}`)
      return response.data
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  })
}

