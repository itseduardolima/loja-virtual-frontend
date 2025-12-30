import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Subscription } from '@/types/subscription'

interface MySubscriptionResponse {
  data: Subscription
}

interface UseMySubscriptionOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useMySubscription(options: UseMySubscriptionOptions = {}) {
  const { enabled = true, refetchInterval = false } = options

  return useQuery<Subscription>({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      try {
        const response = await api.get('/subscriptions/me')
        console.log('Resposta completa de /subscriptions/me:', response.data)
        
        // Se a resposta já é a Subscription diretamente (tem id e status)
        if (response.data && 'id' in response.data && 'status' in response.data) {
          console.log('Retornando Subscription diretamente')
          return response.data as Subscription
        }
        
        // Se a resposta tem wrapper data
        if (response.data && 'data' in response.data && response.data.data) {
          console.log('Retornando Subscription do wrapper data')
          return response.data.data as Subscription
        }
        
        // Fallback: tenta usar a resposta diretamente
        console.log('Usando fallback, retornando response.data diretamente')
        return response.data as Subscription
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error)
        throw error
      }
    },
    retry: 1,
    staleTime: 0, // Sempre considera stale para permitir refetch
    enabled,
    refetchInterval, // Polling automático
  })
}

