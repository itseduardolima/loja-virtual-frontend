import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

export function useCancelScheduledChange() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>('/subscriptions/scheduled-change')
      return response.data
    },
    onSuccess: () => {
      toast.success('Troca agendada cancelada.')
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cancelar troca agendada')
    },
  })
}
