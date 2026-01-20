import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { NicheField, NicheResponse } from '@/types'

export function useNiches(storeId: number | null) {
  return useQuery({
    queryKey: ['niches', storeId],
    queryFn: async (): Promise<NicheResponse> => {
      if (!storeId) {
        return { data: [], message: '' }
      }
      
      const response = await api.get(`/niches/store/${storeId}`)
      return response.data
    },
    enabled: !!storeId,
    retry: false,
    refetchOnWindowFocus: false
  })
}

export function useAllNiches() {
  return useQuery({
    queryKey: ['all-niches'],
    queryFn: async (): Promise<NicheResponse> => {
      const response = await api.get('/niches')
      return response.data
    },
    retry: false,
    refetchOnWindowFocus: false
  })
}

export function useNicheFields(nicheId: number | null) {
  return useQuery({
    queryKey: ['niche-fields', nicheId],
    queryFn: async (): Promise<NicheField[]> => {
      if (!nicheId) throw new Error('Niche ID é obrigatório')
      
      const response = await api.get(`/niches/fields/niche/${nicheId}`)
      // Se a resposta vier com uma estrutura { data: [...] }, retorna data
      // Caso contrário, retorna a resposta diretamente
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    },
    enabled: !!nicheId,
    retry: false,
    refetchOnWindowFocus: false
  })
}

export function useStoreFields(storeId: number | null) {
  return useQuery({
    queryKey: ['store-fields', storeId],
    queryFn: async (): Promise<NicheField[]> => {
      if (!storeId) {
        return []
      }
      
      const response = await api.get(`/niches/fields/store/${storeId}`)
      // Se a resposta vier com uma estrutura { data: [...] }, retorna data
      // Caso contrário, retorna a resposta diretamente
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    },
    enabled: !!storeId,
    retry: false,
    refetchOnWindowFocus: false
  })
}