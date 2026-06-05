import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { StoreCategory, StoreCategoriesResponse, UseStoreCategoriesReturn } from '@/types/store'

export function useStoreCategories(slug: string): UseStoreCategoriesReturn {
  const { data, isLoading, error, refetch } = useQuery<StoreCategory[], Error>({
    queryKey: ['store-categories', slug],
    queryFn: async () => {
      const response = await api.get<StoreCategoriesResponse>(
        `/catalog/store/${slug}/categories`
      )
      return response.data.data
    },
    enabled: !!slug,
    staleTime: 60 * 1000,
    retry: 3,
  })

  const errorMessage = error
    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Erro ao carregar categorias')
    : null

  return {
    categories: data ?? [],
    loading: !!slug && isLoading,
    error: errorMessage,
    refetch: () => { refetch() },
  }
}
