'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarAdmin, UserHeader } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import AccessDenied from '@/components/Layout/AccessDenied'
import { useEffect, useState } from 'react'
import { useValidateToken } from '@/hooks/useValidateToken'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null

  const { data: validatedUser, isLoading: isValidating, isError } = useValidateToken(
    !authLoading && isAuthenticated && !!token
  )

  useEffect(() => {
    if (authLoading || isValidating) {
      setIsReady(false)
      setAccessDenied(false)
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (isError) {
      logout()
      router.push('/login')
      return
    }

    if (validatedUser && validatedUser.profile !== 'Administrador') {
      setAccessDenied(true)
      setIsReady(false)
      return
    }

    if (validatedUser && validatedUser.profile === 'Administrador') {
      setAccessDenied(false)
      const timer = setTimeout(() => setIsReady(true), 200)
      return () => clearTimeout(timer)
    }
  }, [authLoading, isValidating, isAuthenticated, router, validatedUser, isError, logout])

  useEffect(() => {
    if (isReady) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }
  }, [isReady])

  if (authLoading || isValidating) return <LoadingPage />

  if (accessDenied) {
    return (
      <AccessDenied
        title="Acesso Não Permitido"
        message="Esta área é exclusiva para administradores."
      />
    )
  }

  if (!isReady) return <LoadingPage />

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin currentPath={pathname} />
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
