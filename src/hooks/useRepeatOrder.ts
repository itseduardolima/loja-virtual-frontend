import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

interface RepeatOrderResult {
  data: {
    session_id: string
    store_slug: string
    store_id: number
    items_added: number
    items_unavailable: Array<{ product_name: string; reason: string }>
  }
  message: string
}

export function useRepeatOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number): Promise<RepeatOrderResult> => {
      const response = await api.post<RepeatOrderResult>(`/customers/orders/${orderId}/repeat`)
      return response.data
    },
    onSuccess: (result) => {
      const { session_id, store_id, items_unavailable } = result.data

      localStorage.setItem(`cart-session-${store_id}`, session_id)
      queryClient.invalidateQueries({ queryKey: ['cart-session', store_id] })
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'cart-items' && query.queryKey[2] === store_id,
      })

      if (items_unavailable.length > 0) {
        toast(`${result.data.items_added} item(ns) adicionado(s). ${items_unavailable.length} item(ns) indisponível(is).`, { icon: '⚠️' })
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao repetir pedido'
      toast.error(message)
    },
  })
}
