import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { StorePage } from '@/types/store'

export function useStorePages() {
  return useQuery<StorePage[]>({
    queryKey: ['store-pages'],
    queryFn: async () => {
      const res = await api.get<StorePage[]>('/store-pages')
      return res.data
    },
    staleTime: 60 * 1000,
  })
}

export function useUpsertStorePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      type,
      data,
    }: {
      type: string
      data: { title: string; content: string; enabled: boolean }
    }) => {
      const res = await api.put(`/store-pages/${type}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] })
      // storeInfo inclui store_pages — invalida para o footer refletir imediatamente
      queryClient.invalidateQueries({ queryKey: ['store-info'] })
    },
  })
}

export function useStorePage(slug: string, type: string) {
  return useQuery<Pick<StorePage, 'page_type' | 'title' | 'content'>>({
    queryKey: ['store-page', slug, type],
    queryFn: async () => {
      const res = await api.get(`/catalog/store/${slug}/pages/${type}`)
      return res.data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
