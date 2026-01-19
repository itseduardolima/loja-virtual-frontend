'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingPage from '@/components/Layout/LoadingPage'
import AccessDenied from '@/components/Layout/AccessDenied'
import { useEffect, useState } from 'react'
import { useValidateToken } from '@/hooks/useValidateToken'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  
  // Valida o token no backend
  const { data: validatedUser, isLoading: isValidating, isError } = useValidateToken(
    !authLoading && isAuthenticated && !!token
  )

  useEffect(() => {
    if (authLoading || isValidating) {
      setIsReady(false)
      setAccessDenied(false)
      return
    }

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Se a validação falhou (token inválido ou perfil incorreto)
    if (isError) {
      logout()
      router.push('/login')
      return
    }

    // Se está autenticado mas não é administrador, mostra acesso negado
    if (validatedUser && validatedUser.profile !== 'Administrador') {
      setAccessDenied(true)
      setIsReady(false)
      return
    }

    // Se é administrador, permite acesso
    if (validatedUser && validatedUser.profile === 'Administrador') {
      setAccessDenied(false)
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [authLoading, isValidating, isAuthenticated, router, validatedUser, isError, logout])

  // Se está carregando ou validando, mostra loading
  if (authLoading || isValidating) {
    return <LoadingPage />
  }

  // Se não tem acesso, mostra tela de acesso negado
  if (accessDenied) {
    return (
      <AccessDenied
        title="Acesso Não Permitido"
        message="Esta área é exclusiva para administradores. Você precisa ter um perfil de administrador para acessar esta página."
      />
    )
  }

  // Se não está pronto ainda, mostra loading
  if (!isReady) {
    return <LoadingPage />
  }

  return <>{children}</>
}

