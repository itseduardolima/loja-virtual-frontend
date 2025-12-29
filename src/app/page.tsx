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
    if (!isLoading && isAuthenticated && user) {
      const route = PROFILE_ROUTES[user.profile]
      router.push(route)
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <LoadingPage />
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
        ctaHref="/login"
      />
      <Footer />
    </div>
  )
}
