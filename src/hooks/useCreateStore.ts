'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useToastContext } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { myStoreQueryKey } from './useStore'

export interface CreateStoreData {
  name: string
  description?: string
  niche_ids: string[]
  primary_niche_id?: number
  logo?: File
  banner?: File
  whatsapp?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  email?: string
  cnpj?: string
  cpf?: string
  address?: string
  city?: string
  state?: string
  zipcode?: string
  neighborhood?: string
  number?: string
  complement?: string
  delivery_fee?: string | number
  free_delivery_min?: string | number
  delivery_time?: string
  payment_methods?: string[]
  business_hours?: Record<string, string>
}

export function useCreateStore() {
  const { toast } = useToastContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  const createStoreMutation = useMutation({
    mutationFn: async (data: CreateStoreData) => {
      const formData = new FormData()
      
      // Campos obrigatórios
      formData.append('name', data.name)
      data.niche_ids.forEach(id => formData.append('niche_ids[]', id))
      
      // Campos opcionais
      if (data.description) formData.append('description', data.description)
      if (data.primary_niche_id) formData.append('primary_niche_id', data.primary_niche_id.toString())
      if (data.logo) formData.append('logo', data.logo)
      if (data.banner) formData.append('banner', data.banner)
      if (data.whatsapp) formData.append('whatsapp', data.whatsapp)
      if (data.instagram) formData.append('instagram', data.instagram)
      if (data.facebook) formData.append('facebook', data.facebook)
      if (data.tiktok) formData.append('tiktok', data.tiktok)
      if (data.youtube) formData.append('youtube', data.youtube)
      if (data.email) formData.append('email', data.email)
      if (data.cnpj) formData.append('cnpj', data.cnpj)
      if (data.cpf) formData.append('cpf', data.cpf)
      if (data.address) formData.append('address', data.address)
      if (data.city) formData.append('city', data.city)
      if (data.state) formData.append('state', data.state)
      if (data.zipcode) formData.append('zipcode', data.zipcode)
      if (data.neighborhood) formData.append('neighborhood', data.neighborhood)
      if (data.number) formData.append('number', data.number)
      if (data.complement) formData.append('complement', data.complement)
      if (data.delivery_fee !== undefined && data.delivery_fee !== '') {
        const fee = typeof data.delivery_fee === 'string' ? parseFloat(data.delivery_fee) : data.delivery_fee
        if (!isNaN(fee)) formData.append('delivery_fee', fee.toString())
      }
      if (data.free_delivery_min !== undefined && data.free_delivery_min !== '') {
        const min = typeof data.free_delivery_min === 'string' ? parseFloat(data.free_delivery_min) : data.free_delivery_min
        if (!isNaN(min)) formData.append('free_delivery_min', min.toString())
      }
      if (data.delivery_time) formData.append('delivery_time', data.delivery_time)
      if (data.payment_methods) {
        data.payment_methods.forEach(method => formData.append('payment_methods[]', method))
      }
      if (data.business_hours) {
        formData.append('business_hours', JSON.stringify(data.business_hours))
      }

      const response = await api.post('/stores', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso!',
        description: data.message || 'Loja criada com sucesso!',
        variant: 'success'
      })
      
      // Semeia o cache com a loja recém-criada (resposta vem como {data, message})
      // em vez de só invalidar: invalidar dispara um refetch assíncrono, e o
      // router.push abaixo navega antes dele terminar — a página de destino
      // (useVendedorPage) lê `store` como undefined nesse meio-tempo e redireciona
      // de volta para /vendedor/criar-loja, o formulário reaparecendo em branco.
      queryClient.setQueryData(myStoreQueryKey, data?.data ?? data)
      queryClient.invalidateQueries({ queryKey: myStoreQueryKey })

      // Redirecionar para o dashboard
      router.push('/vendedor')
    },
    onError: (error: any) => {
      const errorData = error.response?.data
      let errorMessage = 'Erro ao criar loja'
      
      if (errorData?.message) {
        if (Array.isArray(errorData.message)) {
          // Se for array de mensagens, mostrar cada uma
          errorData.message.forEach((msg: string) => {
            toast({
              title: 'Erro!',
              description: msg,
              variant: 'destructive'
            })
          })
          return
        } else {
          errorMessage = errorData.message
        }
      }
      
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  return {
    createStore: createStoreMutation.mutateAsync,
    isCreating: createStoreMutation.isPending,
    isSuccess: createStoreMutation.isSuccess,
    error: createStoreMutation.error
  }
}
