'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { StoreInfo } from '@/types/store'

export async function fetchMyStore(): Promise<StoreInfo> {
  const response = await api.get('/stores/my-store')
  return response.data
}

export const myStoreQueryKey = ['store', 'my-store'] as const

export function useStore() {
  return useQuery({
    queryKey: myStoreQueryKey,
    queryFn: fetchMyStore,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
