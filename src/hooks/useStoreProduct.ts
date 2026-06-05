import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ProductDetail, ProductDetailResponse } from '@/types/product'

export function useStoreProduct(slug: string, productId: string) {
  return useQuery({
    queryKey: ['store-product', slug, productId],
    queryFn: async (): Promise<ProductDetail> => {
      const response = await api.get<ProductDetailResponse>(
        `/catalog/store/${slug}/products/${productId}`,
      )
      return response.data.data
    },
    enabled: !!slug && !!productId,
  })
}
