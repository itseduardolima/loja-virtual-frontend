import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { StoreInfo, StoreInfoResponse, UseStoreInfoReturn } from '@/types/store'

export function useStoreInfo(slug: string): UseStoreInfoReturn {
  const { data, isLoading, error, refetch } = useQuery<StoreInfo, Error>({
    queryKey: ['store-info', slug],
    queryFn: async () => {
      const response = await api.get<StoreInfoResponse>(`/catalog/store/${slug}`)
      return response.data.data
    },
    enabled: !!slug,
    staleTime: 60 * 1000,
    retry: 3,
  })

  const errorMessage = error
    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Erro ao carregar informações da loja')
    : null

  return {
    storeInfo: data ?? null,
    loading: !!slug && isLoading,
    error: errorMessage,
    refetch: () => { refetch() },
  }
}
