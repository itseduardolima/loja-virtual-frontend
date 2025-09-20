'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest, PROFILE_ROUTES } from '@/types/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useCheckout } from './useCheckout'

export function useLogin() {
  const { login, isLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getCheckoutData, clearCheckoutData } = useCheckout()

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials)
      toast.success('Login realizado com sucesso!')
      
      const checkoutData = getCheckoutData()
      if (checkoutData) {
        clearCheckoutData()
        
        // Se há dados de checkout, redirecionar para a URL específica onde estava
        if (checkoutData.redirectUrl) {
          router.push(checkoutData.redirectUrl)
          return
        } else if (checkoutData.storeSlug) {
          // Fallback para a loja se não houver redirectUrl
          router.push(`/loja/${checkoutData.storeSlug}`)
          return
        }
      }
      
      // Verificar se há parâmetro de redirecionamento
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(redirect)
        return
      }
      
      // Se não há dados de checkout nem redirect, redirecionar para a página inicial
      router.push('/')
      
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
