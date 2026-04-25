'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, AuthContextType } from '@/types/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const processGoogleAuthCallback = () => {
      if (typeof window === 'undefined') return false

      const urlParams = new URLSearchParams(window.location.search)
      const userParam = urlParams.get('user')

      // Google OAuth: backend já setou os cookies; só precisamos processar user data
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam))
          setUser(userData)
          localStorage.setItem('user-data', JSON.stringify(userData))

          const savedRedirectUrl = localStorage.getItem('redirect-after-login')
          localStorage.removeItem('redirect-after-login')

          window.history.replaceState({}, '', window.location.pathname)
          setIsLoading(false)

          const isRedirectAllowed = (path: string) => {
            const normalized = (path || '').replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '/'
            if (normalized === '/' || normalized === '/login' || normalized === '/cadastro') return false
            if (normalized.startsWith('/cadastro/')) return false
            return true
          }

          let targetPath = '/'

          if (userData.profile === 'Vendedor') {
            targetPath = '/vendedor'
          } else if (userData.profile === 'Administrador') {
            targetPath = '/admin'
          } else {
            // Cliente: redirect salvo > última loja > /
            if (savedRedirectUrl && isRedirectAllowed(savedRedirectUrl)) {
              const normalized = savedRedirectUrl.replace(/^https?:\/\/[^/]+/, '')
              targetPath = normalized.startsWith('/') ? normalized : '/' + normalized
            } else {
              const lastStore = localStorage.getItem('last-store')
              if (lastStore) {
                targetPath = `/loja/${lastStore}`
              }
            }
          }

          router.replace(targetPath)
          return true
        } catch (error) {
          console.error('Erro ao processar callback do Google:', error)
          window.history.replaceState({}, '', window.location.pathname)
        }
      }
      return false
    }

    const loadAuthData = () => {
      if (processGoogleAuthCallback()) return

      const savedUser = localStorage.getItem('user-data')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          localStorage.removeItem('user-data')
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    loadAuthData()
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Cookies já foram setados pelo backend; só salva user data
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user-data', JSON.stringify(data.user))
      }
    },
    onError: (error) => {
      console.error('Erro no login:', error)
      throw error
    },
  })

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      // Cookie refresh_token é enviado automaticamente via withCredentials
      const response = await api.post('/auth/refresh_token', {})
      return response.data
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user-data', JSON.stringify(data.user))
      }
    },
    onError: (error) => {
      console.error('Erro ao renovar token:', error)
      logout()
    },
  })

  const login = async (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials)
  }

  const logout = async () => {
    try {
      // Invalida o refresh token no backend e limpa os cookies
      await api.post('/auth/logout')
    } catch {
      // ignora erros de rede no logout
    }
    setUser(null)
    localStorage.removeItem('user-data')
    queryClient.clear()
  }

  const refreshToken = async () => {
    await refreshTokenMutation.mutateAsync()
  }

  const loginWithGoogle = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectParam = urlParams.get('redirect')
      const currentPath = window.location.pathname

      if (redirectParam) {
        localStorage.setItem('redirect-after-login', redirectParam)
      } else if (!currentPath.startsWith('/login')) {
        localStorage.setItem('redirect-after-login', currentPath + (window.location.search || ''))
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL não está configurado')
        return
      }
      window.location.href = `${apiUrl}/auth/google`
    }
  }

  const value: AuthContextType = {
    user,
    token: null, // tokens vivem em cookies httpOnly, não acessíveis ao JS
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    refreshToken,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
