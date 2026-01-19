'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarVendedor, UserHeader } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import AccessDenied from '@/components/Layout/AccessDenied'
import SubscriptionBlocked from '@/components/Layout/SubscriptionBlocked'
import { useEffect, useState } from 'react'
import { useValidateToken } from '@/hooks/useValidateToken'
import { useMySubscription } from '@/hooks/useMySubscription'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, user, logout } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [subscriptionBlocked, setSubscriptionBlocked] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  
  // Valida o token no backend
  const { data: validatedUser, isLoading: isValidating, isError } = useValidateToken(
    !authLoading && isAuthenticated && !!token
  )
  
  // Busca a assinatura do usuário (exceto na página de plano e criar-loja)
  const isPlanoPage = pathname === '/vendedor/plano'
  const isCreateStorePage = pathname === '/vendedor/criar-loja'
  const shouldCheckSubscription = !authLoading && isAuthenticated && !isPlanoPage && !isCreateStorePage
  
  const { data: subscription, isLoading: isLoadingSubscription } = useMySubscription({
    enabled: shouldCheckSubscription,
  })
  
  // Não mostrar sidebar na página de criar loja

  // Aguarda o carregamento completo e verifica se o usuário está autenticado
  useEffect(() => {
    if (authLoading || isValidating) {
      setIsReady(false)
      setAccessDenied(false)
      setSubscriptionBlocked(false)
      return
    }

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      // Evita redirecionamento duplicado
      if (window.location.pathname !== '/login') {
        router.push(redirectUrl)
      }
      return
    }

    // Se a validação falhou (token inválido ou perfil incorreto)
    if (isError) {
      logout()
      router.push('/login')
      return
    }

    // Se está autenticado mas não é vendedor, mostra acesso negado
    if (validatedUser && validatedUser.profile !== 'Vendedor') {
      setAccessDenied(true)
      setIsReady(false)
      setSubscriptionBlocked(false)
      return
    }

    // Se é vendedor, verifica assinatura (exceto na página de plano e criar-loja)
    if (validatedUser && validatedUser.profile === 'Vendedor') {
      // Se está na página de plano ou criar-loja, permite acesso
      if (isPlanoPage || isCreateStorePage) {
        setAccessDenied(false)
        setSubscriptionBlocked(false)
        const timer = setTimeout(() => {
          setIsReady(true)
        }, 200)
        return () => clearTimeout(timer)
      }

      // Verifica assinatura para outras páginas
      if (!isLoadingSubscription) {
        // Se não tem assinatura ou está cancelada/expirada, bloqueia acesso
        if (!subscription || subscription.status === 'canceled' || subscription.status === 'expired') {
          setSubscriptionBlocked(true)
          setAccessDenied(false)
          setIsReady(false)
          return
        }

        // Se tem assinatura ativa ou pendente, permite acesso
        if (subscription.status === 'active' || subscription.status === 'pending') {
          setSubscriptionBlocked(false)
          setAccessDenied(false)
          const timer = setTimeout(() => {
            setIsReady(true)
          }, 200)
          return () => clearTimeout(timer)
        }
      }
    }
  }, [
    authLoading,
    isValidating,
    isAuthenticated,
    user,
    router,
    pathname,
    validatedUser,
    isError,
    logout,
    subscription,
    isLoadingSubscription,
    isPlanoPage,
    isCreateStorePage,
  ])

  // Controla o overflow do body para evitar scroll duplo
  useEffect(() => {
    if (!isCreateStorePage && isReady) {
      // Desabilita scroll no body quando o layout está ativo
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      
      return () => {
        // Restaura o scroll quando o componente desmonta
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }
  }, [isCreateStorePage, isReady])

  // Se está carregando ou validando, mostra loading
  if (authLoading || isValidating || (shouldCheckSubscription && isLoadingSubscription)) {
    return <LoadingPage />
  }

  // Se não tem acesso, mostra tela de acesso negado
  if (accessDenied) {
    return (
      <AccessDenied
        title="Acesso Não Permitido"
        message="Esta área é exclusiva para vendedores. Você precisa ter um perfil de vendedor para acessar esta página."
      />
    )
  }

  // Se a assinatura está cancelada/expirada, mostra tela de bloqueio
  if (subscriptionBlocked) {
    return (
      <SubscriptionBlocked
        title="Assinatura Cancelada"
        message="Sua assinatura foi cancelada ou expirou. Para continuar usando a plataforma, é necessário renovar sua assinatura."
        showManageButton={true}
      />
    )
  }

  // Se não está pronto ainda, mostra loading
  if (!isReady) {
    return <LoadingPage />
  }

  if (isCreateStorePage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarVendedor currentPath={pathname} />
      <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        <UserHeader currentPath={pathname} />
        <div className="flex-1 overflow-y-auto bg-[#FAFAFB]">
          <div className="px-4 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
