'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PROFILE_ROUTES } from '@/types/auth'
import LoadingPage from '@/components/Layout/LoadingPage'
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  PricingSection,
  CTASection,
  Footer,
} from '@/components/Landing'

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só redireciona se estiver na página inicial (/) e não houver redirect salvo
    if (typeof window === 'undefined') return
    
    const currentPath = window.location.pathname
    if (!isLoading && isAuthenticated && user && currentPath === '/') {
      // Verifica se há um redirect salvo (ex: após login com Google)
      const savedRedirect = localStorage.getItem('redirect-after-login')
      if (savedRedirect) {
        // Se houver redirect salvo, não redireciona aqui (deixa o callback do Google fazer isso)
        return
      }
      
      // Verifica se há um flag indicando que já está redirecionando (evita loop)
      const isRedirecting = sessionStorage.getItem('is-redirecting')
      if (isRedirecting) {
        return
      }
      
      const route = PROFILE_ROUTES[user.profile]
      if (route && route !== '/') {
        // Marca que está redirecionando para evitar múltiplos redirecionamentos
        sessionStorage.setItem('is-redirecting', 'true')
        router.push(route)
        // Remove o flag após um tempo
        setTimeout(() => {
          sessionStorage.removeItem('is-redirecting')
        }, 1000)
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  // Se está carregando ou está autenticado e deve redirecionar, mostra apenas loading
  if (isLoading) {
    return <LoadingPage />
  }

  // Se está autenticado e na página inicial, mostra loading enquanto redireciona
  if (isAuthenticated && user) {
    const route = PROFILE_ROUTES[user.profile]
    if (route && route !== '/') {
      return <LoadingPage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection
        title="Pronto para começar a vender?"
        description="Junte-se a vendedores que já estão transformando seus negócios com nossa plataforma"
        ctaText="Criar Minha Loja Agora"
        ctaHref="/assinatura"
      />
      <Footer />
    </div>
  )
}
