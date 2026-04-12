import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useMarkOrderAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => api.patch(`/orders/${orderId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
