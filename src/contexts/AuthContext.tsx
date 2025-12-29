'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, AuthContextType, PROFILE_ROUTES } from '@/types/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const processGoogleAuthCallback = () => {
      // Verifica se há parâmetros de autenticação do Google na URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const userParam = urlParams.get('user')

        if (accessToken && refreshToken && userParam) {
          try {
            // Decodifica o parâmetro user que está URL-encoded
            const decodedUser = decodeURIComponent(userParam)
            const userData = JSON.parse(decodedUser)

            // Salva os dados
            setToken(accessToken)
            setUser(userData)
            localStorage.setItem('auth-token', accessToken)
            localStorage.setItem('refresh-token', refreshToken)
            localStorage.setItem('user-data', decodedUser)

            // Verifica se há URL de redirecionamento salva
            const savedRedirectUrl = localStorage.getItem('redirect-after-login')
            
            // Limpa os parâmetros da URL
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)

            setIsLoading(false)

            // Redireciona após um pequeno delay para garantir que o estado foi atualizado
            setTimeout(() => {
              if (savedRedirectUrl) {
                // Remove a URL salva do localStorage
                localStorage.removeItem('redirect-after-login')
                // Redireciona para a URL salva
                window.location.href = savedRedirectUrl
              } else {
                // Se não houver URL salva, redireciona de acordo com o perfil
                const userProfile = userData.profile as keyof typeof PROFILE_ROUTES
                const profileRoute = PROFILE_ROUTES[userProfile] || '/'
                window.location.href = profileRoute
              }
            }, 100)

            return true // Indica que processou o callback
          } catch (error) {
            console.error('Erro ao processar callback do Google:', error)
            // Limpa a URL mesmo em caso de erro
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
          }
        }
      }
      return false
    }

    const loadAuthData = () => {
      // Primeiro, tenta processar callback do Google
      const processedCallback = processGoogleAuthCallback()
      
      // Se processou o callback, não precisa carregar do localStorage
      if (processedCallback) {
        return
      }

      const savedToken = localStorage.getItem('auth-token')
      const savedUser = localStorage.getItem('user-data')

      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
          setToken(null)
          setUser(null)
        }
      } else {
        setToken(null)
        setUser(null)
      }
      setIsLoading(false)
    }

    // Carrega os dados iniciais
    loadAuthData()

    // Listener para mudanças no localStorage (quando o interceptor limpa os tokens)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-token' && !e.newValue) {
        setToken(null)
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      const { user, access_token, refresh_token } = data
      setUser(user)
      setToken(access_token)
      localStorage.setItem('auth-token', access_token)
      localStorage.setItem('refresh-token', refresh_token)
      localStorage.setItem('user-data', JSON.stringify(user))
    },
    onError: (error) => {
      console.error('Erro no login:', error)
      throw error
    },
  })

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refresh-token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
      return response.data
    },
    onSuccess: (data) => {
      const { access_token, refresh_token } = data
      setToken(access_token)
      localStorage.setItem('auth-token', access_token)
      localStorage.setItem('refresh-token', refresh_token)
    },
    onError: (error) => {
      console.error('Erro ao renovar token:', error)
      logout()
    },
  })

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth-token')
    localStorage.removeItem('refresh-token')
    localStorage.removeItem('user-data')
    queryClient.clear()
  }

  const refreshToken = async () => {
    await refreshTokenMutation.mutateAsync()
  }

  const loginWithGoogle = () => {
    // Salva a URL atual para redirecionar após o login
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectParam = urlParams.get('redirect')
      const currentPath = window.location.pathname
      
      // Se há parâmetro redirect na URL (vindo da página de login), salva ele
      if (redirectParam) {
        localStorage.setItem('redirect-after-login', redirectParam)
      } else if (!currentPath.startsWith('/login')) {
        // Se não estiver na página de login, salva a URL atual
        const currentUrl = currentPath + (window.location.search || '')
        localStorage.setItem('redirect-after-login', currentUrl)
      }
      // Se estiver na página de login sem redirect, não salva nada (vai para rota do perfil)
    }
    
    // Redireciona diretamente para o endpoint do Google OAuth
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL não está configurado')
      return
    }
    window.location.href = `${apiUrl}/auth/google`
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    refreshToken,
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
