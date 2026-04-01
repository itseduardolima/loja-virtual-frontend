import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product } from '@/types/product'

interface TopRatedResponse {
  data: Product[]
}

export function useTopRatedProducts(slug: string, limit = 8) {
  return useQuery<TopRatedResponse>({
    queryKey: ['top-rated-products', slug, limit],
    queryFn: async () => {
      const response = await api.get<TopRatedResponse>(
        `/catalog/store/${slug}/top-rated?limit=${limit}`,
      )
      return response.data
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}
