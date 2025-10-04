'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useToastContext } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

export interface UpdateStoreData {
  name?: string
  description?: string
  niche_ids?: string[]
  primary_niche_id?: number
  logo?: File
  banner?: File
  whatsapp?: string
  instagram?: string
  facebook?: string
  website?: string
  email?: string
  phone?: string
  cnpj?: string
  cpf?: string
  address?: string
  city?: string
  state?: string
  zipcode?: string
  neighborhood?: string
  number?: string
  complement?: string
  delivery_fee?: number
  free_delivery_min?: number
  delivery_time?: string
  payment_methods?: string[]
  business_hours?: Record<string, string>
}

export function useUpdateStore() {
  const { toast } = useToastContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  const updateStoreMutation = useMutation({
    mutationFn: async ({ storeId, data }: { storeId: number; data: UpdateStoreData }) => {
      const formData = new FormData()
      
      // Adicionar apenas os campos que foram fornecidos
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'logo' || key === 'banner') {
            if (value instanceof File) {
              formData.append(key, value)
            }
          } else if (key === 'niche_ids' && Array.isArray(value)) {
            value.forEach(id => formData.append('niche_ids[]', id))
          } else if (key === 'payment_methods' && Array.isArray(value)) {
            value.forEach(method => formData.append('payment_methods[]', method))
          } else if (key === 'business_hours' && typeof value === 'object') {
            formData.append('business_hours', JSON.stringify(value))
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      const response = await api.patch(`/stores/${storeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    }
  })

  const updateStore = async ({ storeId, data }: { storeId: number; data: UpdateStoreData }) => {
    try {
      const result = await updateStoreMutation.mutateAsync({ storeId, data })
      
      toast({
        title: 'Sucesso!',
        description: 'As informações da loja foram salvas com sucesso.',
        variant: 'success'
      })
      
      // Invalidar cache da loja
      queryClient.invalidateQueries({ queryKey: ['store'] })
      
      // Redirecionar para o dashboard
      router.push('/vendedor')
      
      return result
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar loja'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    updateStore,
    updateStoreAsync: updateStoreMutation.mutateAsync,
    isUpdating: updateStoreMutation.isPending,
    error: updateStoreMutation.error
  }
}
