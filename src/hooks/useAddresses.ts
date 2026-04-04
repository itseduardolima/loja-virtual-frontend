import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'

export interface Address {
  id: number
  label?: string
  name: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zipcode: string
  is_default: number
}

export interface CreateAddressData {
  label?: string
  name: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zipcode: string
  is_default?: number
}

export function useAddresses(enabled = true) {
  const { toast } = useToastContext()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get<{ data: Address[] }>('/addresses')
      return res.data.data
    },
    enabled,
  })

  const createMutation = useMutation({
    mutationFn: async (addressData: CreateAddressData) => {
      const res = await api.post('/addresses', addressData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast({ title: 'Endereço salvo!', variant: 'success' })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar endereço',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateAddressData> }) => {
      const res = await api.patch(`/addresses/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast({ title: 'Endereço atualizado!', variant: 'success' })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar endereço',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/addresses/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast({ title: 'Endereço removido!', variant: 'success' })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover endereço',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      })
    },
  })

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/addresses/${id}/default`, {})
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })

  return {
    addresses: data ?? [],
    isLoading,
    createAddress: createMutation.mutateAsync,
    updateAddress: updateMutation.mutateAsync,
    removeAddress: removeMutation.mutateAsync,
    setDefaultAddress: setDefaultMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
