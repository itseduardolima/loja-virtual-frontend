'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarAdmin } from '@/components'
import { LoadingPage, AccessDenied, BottomNavAdmin, UserHeaderAdmin } from '@/components/Layout'
import { useEffect, useState } from 'react'
import { useValidateToken } from '@/hooks/useValidateToken'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const { data: validatedUser, isLoading: isValidating, isError } = useValidateToken(
    !authLoading && isAuthenticated,
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
    <div className="flex h-screen overflow-hidden bg-nxbg">
      <div className="hidden lg:flex h-full">
        <SidebarAdmin currentPath={pathname} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <UserHeaderAdmin currentPath={pathname} />
        <main className="flex-1 overflow-y-auto bg-nxbg">
          <div className="mx-auto max-w-[1640px] px-4 py-4 pb-[80px] lg:px-6 lg:py-6 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
      <BottomNavAdmin currentPath={pathname} />
    </div>
  )
}
