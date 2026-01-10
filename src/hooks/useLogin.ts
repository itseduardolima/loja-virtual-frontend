'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToastContext } from '@/contexts/ToastContext'
import { useCheckout } from './useCheckout'

export function useLogin() {
  const { login, isLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getCheckoutData, clearCheckoutData } = useCheckout()
  const { success: showSuccess, error: showError } = useToastContext()

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials)
      showSuccess('Login realizado com sucesso!')
      
      const checkoutData = getCheckoutData()
      if (checkoutData) {
        clearCheckoutData()
        
        // Se há dados de checkout, redirecionar para a URL específica onde estava
        // Validar que a URL não contenha 'null' ou seja inválida
        if (checkoutData.redirectUrl && !checkoutData.redirectUrl.includes('/produto/null') && !checkoutData.redirectUrl.includes('/produto/undefined')) {
          router.push(checkoutData.redirectUrl)
          return
        } else if (checkoutData.storeSlug) {
          // Fallback para a loja se não houver redirectUrl válido
          router.push(`/loja/${checkoutData.storeSlug}/produtos`)
          return
        }
      }
      
      // Verificar se há parâmetro de redirecionamento
      const redirect = searchParams.get('redirect')
      if (redirect && !redirect.includes('/produto/null') && !redirect.includes('/produto/undefined')) {
        router.push(redirect)
        return
      }
      
      // Se não há dados de checkout nem redirect, sempre redireciona para a página inicial
      router.push('/')
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      showError(errorMessage, 'Erro')
      throw error
    }
  }

  return {
    login: handleLogin,
    isLoading,
  }
}
