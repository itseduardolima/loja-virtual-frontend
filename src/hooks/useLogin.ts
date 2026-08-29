'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { fetchMyStore, myStoreQueryKey } from './useStore'

// Erros de login propagam para a página exibir no banner inline (design Login.html).
export function useLogin() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const isRedirectAllowed = (path: string) => {
    const normalized = path.replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '/'
    if (normalized === '/' || normalized === '/login' || normalized === '/cadastro') return false
    if (normalized.startsWith('/cadastro/')) return false
    if (path.includes('/produto/null') || path.includes('/produto/undefined')) return false
    return true
  }

  const handleLogin = async (credentials: LoginRequest) => {
    const data = await login(credentials)

    const profile = data.user.profile

    if (profile === 'Vendedor') {
      try {
        await queryClient.fetchQuery({
          queryKey: myStoreQueryKey,
          queryFn: fetchMyStore,
        })
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

    // Cliente: ?redirect > última loja visitada > /
    // (o antigo ramo 'checkout-data' era código morto — nada gravava essa chave;
    // ?redirect + last-store já cobrem o retorno pós-login — bug B10.)
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
  }

  return {
    login: handleLogin,
    isLoading,
  }
}
