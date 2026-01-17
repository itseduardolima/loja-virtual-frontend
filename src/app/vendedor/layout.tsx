'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarVendedor, UserHeader } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useEffect, useState } from 'react'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isLoading: authLoading, isAuthenticated, user } = useAuth()
  const [isReady, setIsReady] = useState(false)
  
  // Não mostrar sidebar na página de criar loja
  const isCreateStorePage = pathname === '/vendedor/criar-loja'

  // Aguarda o carregamento completo e verifica se o usuário está autenticado
  useEffect(() => {
    if (authLoading) {
      setIsReady(false)
      return
    }

    if (isAuthenticated && user?.profile === 'Vendedor') {
      // Pequeno delay para garantir que tudo está pronto e evitar flash do sidebar
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setIsReady(false)
    }
  }, [authLoading, isAuthenticated, user])

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

  // Se está carregando ou não está pronto, mostra apenas loading
  if (authLoading || !isReady) {
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
