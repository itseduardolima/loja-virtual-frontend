'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest, PROFILE_ROUTES } from '@/types/auth'
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
      
      // Se não há dados de checkout nem redirect, redirecionar de acordo com o perfil
      // Nota: o user pode não estar atualizado imediatamente após login, então usamos um pequeno delay
      setTimeout(() => {
        const currentUser = user || JSON.parse(localStorage.getItem('user-data') || 'null')
        if (currentUser && currentUser.profile) {
          const profileRoute = PROFILE_ROUTES[currentUser.profile as keyof typeof PROFILE_ROUTES] || '/'
          router.push(profileRoute)
        } else {
          router.push('/')
        }
      }, 100)
      
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
