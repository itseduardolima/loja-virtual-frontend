'use client'

import { useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/contexts/AuthContext'
import type { AxiosError } from 'axios'

export function useLoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const { login: loginFunction, isLoading } = useLogin()
  const { loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!login || !password) return
    try {
      await loginFunction({ login, password })
    } catch (err) {
      const axiosErr = err as AxiosError
      console.error('Erro no login:', axiosErr.message)
    }
  }

  return {
    login,
    setLogin,
    password,
    setPassword,
    isLoading,
    handleSubmit,
    loginWithGoogle,
  }
}
