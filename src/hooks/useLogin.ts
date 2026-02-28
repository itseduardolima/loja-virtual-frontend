'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToastContext } from '@/contexts/ToastContext'
import { useCheckout } from './useCheckout'

export function useLogin() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getCheckoutData, clearCheckoutData } = useCheckout()
  const { success: showSuccess, error: showError } = useToastContext()

  const isRedirectAllowed = (path: string) => {
    const normalized = path.replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '/'
    if (normalized === '/' || normalized === '/login' || normalized === '/cadastro') return false
    if (normalized.startsWith('/cadastro/')) return false
    if (path.includes('/produto/null') || path.includes('/produto/undefined')) return false
    return true
  }

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const data = await login(credentials)
      showSuccess('Login realizado com sucesso!')

      const profile = data.user.profile

      // Vendedor: redireciona direto para a página do vendedor (navegação completa evita passar por "/")
      if (profile === 'Vendedor') {
        window.location.href = '/vendedor'
        return
      }

      // Cliente (ou outros perfis): checkout tem prioridade; depois última página válida
      const checkoutData = getCheckoutData()
      if (checkoutData) {
        clearCheckoutData()
        if (checkoutData.redirectUrl && isRedirectAllowed(checkoutData.redirectUrl)) {
          router.push(checkoutData.redirectUrl)
          return
        }
        if (checkoutData.storeSlug) {
          router.push(`/loja/${checkoutData.storeSlug}/produtos`)
          return
        }
      }

      const redirect = searchParams.get('redirect')
      if (redirect && isRedirectAllowed(redirect)) {
        router.push(redirect)
        return
      }

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
