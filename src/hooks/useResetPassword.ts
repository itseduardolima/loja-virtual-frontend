'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface ResetPasswordRequest {
  /** Token de recuperação vindo do link do e-mail (?token=) — vai no header, nunca persistido */
  token: string
  new_password: string
  confirmPassword: string
}

// POST /auth/reset_password — autenticado pelo token de recuperação (Bearer), não pelos cookies.
export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: async ({ token, ...data }: ResetPasswordRequest) => {
      const response = await api.post('/auth/reset_password', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    },
  })

  return {
    resetPassword: mutation.mutate,
    isResetting: mutation.isPending,
  }
}
