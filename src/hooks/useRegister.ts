'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  whatsapp?: string
}

export function useRegister() {
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToastContext()

  const mutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post('/user/register', data)
      return response.data
    },
    onSuccess: () => {
      showSuccess('Cadastro realizado com sucesso! Faça login para continuar.')
      router.push('/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Não foi possível realizar o cadastro. Tente novamente.'
      showError(message, 'Erro no cadastro')
    },
  })

  return {
    register: mutation.mutate,
    isRegistering: mutation.isPending,
  }
}
