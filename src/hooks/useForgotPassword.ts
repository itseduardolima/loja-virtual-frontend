'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

// POST /auth/forgot_password — resposta é genérica de propósito (não revela se o e-mail existe).
export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await api.post('/auth/forgot_password', data)
      return response.data
    },
  })

  return {
    forgotPassword: mutation.mutate,
    isSending: mutation.isPending,
  }
}
