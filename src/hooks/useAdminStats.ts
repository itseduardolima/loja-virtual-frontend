import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminStats } from '@/types/admin'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      const res = await api.get('/admin/stats')
      return res.data
    },
    staleTime: 30000,
  })
}
