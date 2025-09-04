'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest, PROFILE_ROUTES } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function useLogin() {
  const { login, isLoading, user } = useAuth()
  const router = useRouter()

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials)
      toast.success('Login realizado com sucesso!')
      
      if (user) {
        const route = PROFILE_ROUTES[user.profile]
        router.push(route)
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(errorMessage)
      throw error
    }
  }

  return {
    login: handleLogin,
    isLoading,
  }
}
