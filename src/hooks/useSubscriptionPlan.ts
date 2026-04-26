import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { SubscriptionPlan } from '@/types/subscription'

interface SubscriptionPlanResponse {
  data?: SubscriptionPlan
  id?: number
  name?: string
  slug?: string
  description?: string
  price_monthly?: string
  price_yearly?: string | null
  max_products?: number | null
  status?: number
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export function useSubscriptionPlan() {
  return useQuery<SubscriptionPlan>({
    queryKey: ['subscription-plan'],
    queryFn: async () => {
      try {
        const response = await api.get<SubscriptionPlanResponse | SubscriptionPlan>('/subscriptions/plan')
        
        // Se a resposta já é o plano diretamente (sem wrapper data)
        if ('id' in response.data && 'name' in response.data) {
          return response.data as SubscriptionPlan
        }
        
        // Se a resposta tem wrapper data
        if ('data' in response.data && response.data.data) {
          return response.data.data
        }
        
        // Fallback: tenta usar a resposta diretamente
        return response.data as SubscriptionPlan
      } catch (error: any) {
        console.error('Erro ao buscar plano:', error)
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data
        })
        throw error
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

