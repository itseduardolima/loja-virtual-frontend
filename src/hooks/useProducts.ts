import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { ProductsResponse } from '@/types/product'

export function useProducts() {
  return useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products/my-products')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
