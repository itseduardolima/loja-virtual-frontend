'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, AuthContextType } from '@/types/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
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
      }
    }
    setIsLoading(false)
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
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
      return response.data
    },
    onSuccess: (data) => {
      const { access_token, refresh_token } = data
      setToken(access_token)
      localStorage.setItem('auth-token', access_token)
      localStorage.setItem('refresh-token', refresh_token)
    },
    onError: () => {
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

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
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
