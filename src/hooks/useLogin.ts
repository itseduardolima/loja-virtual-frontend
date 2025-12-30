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
      // Busca o usuário do localStorage imediatamente após o login
      const currentUser = JSON.parse(localStorage.getItem('user-data') || 'null')
      if (currentUser && currentUser.profile) {
        const profileRoute = PROFILE_ROUTES[currentUser.profile as keyof typeof PROFILE_ROUTES] || '/'
        // Redireciona diretamente sem delay
        router.push(profileRoute)
      } else {
        // Se não conseguir obter o perfil, vai para home (que mostrará loading)
        router.push('/')
      }
      
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
