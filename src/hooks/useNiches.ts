'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface Niche {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  status: number
  sort_order: number
  created_at: string
  updated_at: string
  _count: {
    store_niches: number
  }
}

export interface NichesResponse {
  data: Niche[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export function useNiches() {
  return useQuery({
    queryKey: ['niches'],
    queryFn: async (): Promise<NichesResponse> => {
      const response = await api.get('/niches')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
