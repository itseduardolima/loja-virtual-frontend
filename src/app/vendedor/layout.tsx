'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarVendedor, UserHeader } from '@/components'
import { LoadingPage, AccessDenied, SubscriptionBlocked, BottomNav } from '@/components/Layout'
import { useEffect, useState } from 'react'
import { useValidateToken } from '@/hooks/useValidateToken'
import { useMySubscription } from '@/hooks/useSubscription'
import { useOrderNotifications } from '@/hooks/useOrderNotifications'

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
  // Valida o token no backend (cookie é enviado automaticamente)
  const { data: validatedUser, isLoading: isValidating, isError } = useValidateToken(
    !authLoading && isAuthenticated
  )
  
  // Busca a assinatura do usuário (exceto na página de plano e criar-loja)
  const isPlanoPage = pathname === '/vendedor/plano'
  const isCreateStorePage = pathname === '/vendedor/criar-loja'
  const shouldCheckSubscription = !authLoading && isAuthenticated && !isPlanoPage && !isCreateStorePage
  
  const { data: subscription, isLoading: isLoadingSubscription } = useMySubscription({
    enabled: shouldCheckSubscription,
  })

  const {
    notifications: orderNotifications,
    markAllAsRead: markOrderNotificationsRead,
    markAsRead: markOrderNotificationAsRead,
    dismiss: dismissOrderNotification,
    clearAll: clearAllOrderNotifications,
  } = useOrderNotifications(isReady)
  
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
      if (pathname !== '/login') {
        router.push('/login')
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
        // Se não tem assinatura, ou está cancelada/expirada/pendente, bloqueia acesso
        // (o backend só libera com status === 'active')
        if (
          !subscription ||
          subscription.status === 'canceled' ||
          subscription.status === 'expired' ||
          subscription.status === 'pending'
        ) {
          setSubscriptionBlocked(true)
          setAccessDenied(false)
          setIsReady(false)
          return
        }

        // Se tem assinatura ativa, permite acesso
        if (subscription.status === 'active') {
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

  // Se a assinatura está cancelada/expirada/pendente, mostra tela de bloqueio
  if (subscriptionBlocked) {
    const isPending = subscription?.status === 'pending'
    return (
      <SubscriptionBlocked
        title={isPending ? 'Pagamento Pendente' : 'Assinatura Cancelada'}
        message={
          isPending
            ? 'Sua assinatura está aguardando confirmação do pagamento. Assim que ele for processado, seu acesso será liberado automaticamente.'
            : 'Sua assinatura foi cancelada ou expirou. Para continuar usando a plataforma, é necessário renovar sua assinatura.'
        }
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

  const pendingOrdersCount = orderNotifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen overflow-hidden bg-nxbg">
      <div className="hidden lg:flex h-full">
        <SidebarVendedor currentPath={pathname} pendingOrdersCount={pendingOrdersCount} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <UserHeader
          currentPath={pathname}
          notifications={orderNotifications}
          onMarkAllAsRead={markOrderNotificationsRead}
          onMarkAsRead={markOrderNotificationAsRead}
          onDismiss={dismissOrderNotification}
          onClearAll={clearAllOrderNotifications}
        />
        <main aria-label="Conteúdo principal" className="flex-1 overflow-y-auto bg-nxbg">
          <div className="mx-auto max-w-[1640px] px-4 py-4 pb-[80px] lg:px-6 lg:py-6 lg:pb-6">{children}</div>
        </main>
      </div>
      <BottomNav currentPath={pathname} pendingOrdersCount={pendingOrdersCount} />
    </div>
  )
}
