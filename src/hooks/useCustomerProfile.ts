import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { UpdateCustomerProfileDto, UpdateProfileResponse, CustomerProfile } from '@/types/customer'
import toast from 'react-hot-toast'

export function useCustomerProfile() {
  const queryClient = useQueryClient()

  // Query para buscar o perfil
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: async (): Promise<UpdateProfileResponse> => {
      const response = await api.get<UpdateProfileResponse>('/customers/profile')
      return response.data
    },
    enabled: false, // Não busca automaticamente, só quando chamado manualmente
  })

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateCustomerProfileDto): Promise<UpdateProfileResponse> => {
      const response = await api.patch<UpdateProfileResponse>('/customers/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customer-profile'] })
      toast.success(data.message || 'Perfil atualizado com sucesso')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Erro ao atualizar perfil'
      toast.error(message)
    },
  })

  const fetchProfile = () => {
    return queryClient.fetchQuery({
      queryKey: ['customer-profile'],
      queryFn: async (): Promise<UpdateProfileResponse> => {
        const response = await api.get<UpdateProfileResponse>('/customers/profile')
        return response.data
      },
    })
  }

  return {
    profile: profile?.data,
    isLoadingProfile,
    profileError,
    fetchProfile,
    updateProfile: updateProfile.mutate,
    updateProfileAsync: updateProfile.mutateAsync,
    isUpdating: updateProfile.isPending,
  }
}

