import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface ValidateTokenResponse {
  id: number
  name: string
  email: string
  profile_id: number | null
  profile: string | null
  first_access: number
}

export function useValidateToken(enabled: boolean = true) {
  return useQuery<ValidateTokenResponse>({
    queryKey: ['validate-token'],
    queryFn: async () => {
      const response = await api.get<ValidateTokenResponse>('/auth/validate')
      return response.data
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

