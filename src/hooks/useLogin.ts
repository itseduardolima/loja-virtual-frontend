'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToastContext } from '@/contexts/ToastContext'
import { useCheckout } from './useCheckout'
import { api } from '@/lib/api'

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

      if (profile === 'Vendedor') {
        try {
          await api.get('/stores/my-store')
          router.push('/vendedor')
        } catch (err: any) {
          const status = err?.response?.status
          router.push(status === 404 ? '/vendedor/criar-loja' : '/vendedor')
        }
        return
      }

      if (profile === 'Administrador') {
        router.push('/admin')
        return
      }

      // Cliente: checkout > ?redirect > última loja visitada > /
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

      const lastStore = localStorage.getItem('last-store')
      if (lastStore) {
        router.push(`/loja/${lastStore}`)
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
