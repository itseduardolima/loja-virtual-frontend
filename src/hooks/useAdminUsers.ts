import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AdminUser } from '@/types/admin'

export function useAdminUsers(params?: { page?: number; limit?: number; search?: string; profile?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const res = await api.get('/user', { params })
      return res.data
    },
  })
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async (): Promise<AdminUser> => {
      const res = await api.get(`/user/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useAdminUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdminUser> }) => {
      const res = await api.patch(`/user/${id}`, data)
      return res.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user', id] })
    },
  })
}

export function useAdminToggleUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/user/${id}/status`)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
