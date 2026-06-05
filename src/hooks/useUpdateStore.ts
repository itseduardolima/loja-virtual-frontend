'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useToastContext } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

export interface UpdateStoreOptions {
  redirectOnSuccess?: boolean
  silent?: boolean
}

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
  pickup_enabled?: boolean
  free_shipping_enabled?: boolean
  payment_methods?: string[]
  business_hours?: Record<string, string>
  hero_eyebrow?: string
  hero_title?: string
  hero_subtitle?: string
  announcement_text?: string
  campaign_title?: string
  campaign_text?: string
}

// Campos de conteúdo da vitrine: string vazia é enviada para limpar o override
const CLEARABLE_FIELDS = new Set([
  'hero_eyebrow',
  'hero_title',
  'hero_subtitle',
  'announcement_text',
  'campaign_title',
  'campaign_text',
])

export function useUpdateStore(options: UpdateStoreOptions = {}) {
  const { redirectOnSuccess = false, silent = false } = options
  const { toast } = useToastContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  const updateStoreMutation = useMutation({
    mutationFn: async ({ storeId, data }: { storeId: number; data: UpdateStoreData }) => {
      const formData = new FormData()
      
      // Adicionar apenas os campos que foram fornecidos
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && (value !== '' || CLEARABLE_FIELDS.has(key))) {
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

      if (!silent) {
        toast({
          title: 'Sucesso!',
          description: 'As informações da loja foram salvas com sucesso.',
          variant: 'success'
        })
      }

      // Invalidar cache da loja
      queryClient.invalidateQueries({ queryKey: ['store'] })

      if (redirectOnSuccess) {
        router.push('/vendedor')
      }

      return result
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar loja'
      if (!silent) {
        toast({
          title: 'Erro!',
          description: errorMessage,
          variant: 'destructive'
        })
      }
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
