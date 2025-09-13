'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { StoreInfo } from '@/types/store'

export function useStore() {
  return useQuery({
    queryKey: ['store', 'my-store'],
    queryFn: async (): Promise<StoreInfo> => {
      const response = await api.get('/stores/my-store')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
