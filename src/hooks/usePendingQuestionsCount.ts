import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export function usePendingQuestionsCount() {
  return useQuery({
    queryKey: ['store-questions-pending-count'],
    queryFn: async () => {
      const res = await api.get('/product-questions', {
        params: { page: 1, limit: 1, status: 1 },
      })
      return (res.data?.meta?.total ?? 0) as number
    },
    staleTime: 60_000,
  })
}
