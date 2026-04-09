import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface BlingSync {
  orderId: number
  orderCode: string | null
  blingOrderId: string | null
  status: 'pending' | 'synced' | 'error'
  errorMessage: string | null
  syncedAt: string | null
  createdAt: string
}

export interface BlingStatus {
  connected: boolean
  syncEnabled: boolean
  connectedAt: string | null
  recentSyncs: BlingSync[]
}

export function useBlingStatus() {
  return useQuery({
    queryKey: ['bling-status'],
    queryFn: async (): Promise<BlingStatus> => {
      const res = await api.get<BlingStatus>('/integrations/bling/status')
      return res.data
    },
    staleTime: 30_000,
  })
}

export function useBlingConnect() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get<{ authUrl: string }>('/integrations/bling/connect')
      return res.data.authUrl
    },
    onSuccess: (authUrl) => {
      window.location.href = authUrl
    },
  })
}

export function useBlingDisconnect() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/integrations/bling/disconnect'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bling-status'] }),
  })
}

export function useBlingToggleSync() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (enabled: boolean) =>
      api.patch('/integrations/bling/toggle-sync', { enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bling-status'] }),
  })
}
