'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useResetPassword } from '@/hooks/useResetPassword'
import { isValidPassword, passwordRules, passwordsMatch } from '@/schemas/authSchemas'

export function useResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { resetPassword, isResetting } = useResetPassword()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState<{ newPassword?: boolean; confirmPassword?: boolean }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const requirements = useMemo(() => passwordRules(newPassword), [newPassword])

  const passwordError =
    touched.newPassword && !isValidPassword(newPassword)
      ? 'A senha não atende aos requisitos abaixo.'
      : null
  const confirmPasswordError =
    touched.confirmPassword && !passwordsMatch(newPassword, confirmPassword)
      ? 'As senhas não coincidem.'
      : null

  function markTouched(field: 'newPassword' | 'confirmPassword') {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setTouched({ newPassword: true, confirmPassword: true })
    setAuthError(null)
    if (!isValidPassword(newPassword) || !passwordsMatch(newPassword, confirmPassword)) return

    resetPassword(
      { token, new_password: newPassword, confirmPassword },
      {
        onSuccess: () => setDone(true),
        onError: (error: any) => {
          setAuthError(
            error?.response?.data?.message ??
              'O link de recuperação expirou ou é inválido. Solicite um novo e tente de novo.',
          )
        },
      },
    )
  }

  return {
    hasToken: !!token,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    requirements,
    passwordError,
    confirmPasswordError,
    authError,
    markTouched,
    done,
    isResetting,
    handleSubmit,
  }
}
