import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface EmitNfeResponse {
  nfeId: string
  status: string
}

export function useEmitNfe(orderId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<EmitNfeResponse> => {
      if (!orderId) throw new Error('orderId obrigatório')
      const res = await api.post<EmitNfeResponse>(
        `/integrations/bling/orders/${orderId}/emit-nfe`,
      )
      return res.data
    },
    onSuccess: () => {
      if (orderId) {
        qc.invalidateQueries({ queryKey: ['order', orderId] })
        qc.invalidateQueries({ queryKey: ['orders'] })
        qc.invalidateQueries({ queryKey: ['order-detail', orderId] })
      }
    },
  })
}
