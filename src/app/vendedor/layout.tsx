'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarVendedor, UserHeader } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import AccessDenied from '@/components/Layout/AccessDenied'
import { useEffect, useState } from 'react'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, user } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  
  // Não mostrar sidebar na página de criar loja
  const isCreateStorePage = pathname === '/vendedor/criar-loja'

  // Aguarda o carregamento completo e verifica se o usuário está autenticado
  useEffect(() => {
    if (authLoading) {
      setIsReady(false)
      setAccessDenied(false)
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

    // Se está autenticado mas não é vendedor, mostra acesso negado
    if (isAuthenticated && user && user.profile !== 'Vendedor') {
      setAccessDenied(true)
      setIsReady(false)
      return
    }

    // Se é vendedor, permite acesso
    if (isAuthenticated && user?.profile === 'Vendedor') {
      setAccessDenied(false)
      // Pequeno delay para garantir que tudo está pronto e evitar flash do sidebar
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [authLoading, isAuthenticated, user, router, pathname])

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

  // Se está carregando, mostra loading
  if (authLoading) {
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
