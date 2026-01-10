import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { UpdateCustomerProfileDto, UpdateProfileResponse, CustomerProfile } from '@/types/customer'
import toast from 'react-hot-toast'

export function useCustomerProfile() {
  const queryClient = useQueryClient()

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
      const message = error.response?.data?.message || 'Erro ao atualizar perfil'
      toast.error(message)
    },
  })

  return {
    updateProfile: updateProfile.mutate,
    updateProfileAsync: updateProfile.mutateAsync,
    isUpdating: updateProfile.isPending,
  }
}

