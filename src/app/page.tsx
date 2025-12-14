'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PROFILE_ROUTES } from '@/types/auth'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const route = PROFILE_ROUTES[user.profile]
      router.push(route)
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo à Loja
        </h1>
        <p className="text-gray-600 mb-8">
          Sistema de gerenciamento de loja online
        </p>
        <Link 
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Fazer Login
        </Link>
      </div>
    </main>
  )
}
