'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FeatureCard } from './FeatureCard'
import { SectionHeader } from './SectionHeader'

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    title: 'Catálogo de Produtos',
    description:
      'Exiba seus produtos de forma organizada e atrativa. Gerencie categorias, variações, imagens e informações detalhadas de cada item.',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-blue-600',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: 'Gestão de Pedidos',
    description:
      'Controle total sobre seus pedidos. Acompanhe status, atualize entregas e mantenha seus clientes sempre informados sobre suas compras.',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-purple-600',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: 'Dashboard de Vendas',
    description:
      'Visualize métricas importantes em tempo real. Acompanhe receita, produtos mais vendidos e estatísticas comparativas do seu negócio.',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-green-600',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Gestão Completa',
    description:
      'Configure métodos de pagamento, opções de entrega, endereços e todas as informações necessárias para operar sua loja com eficiência.',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-orange-600',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Loja Personalizada',
    description:
      'Crie uma loja única com seu próprio domínio, logo, banner e identidade visual. Seus clientes terão uma experiência personalizada.',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-pink-600',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Interface Intuitiva',
    description:
      'Plataforma fácil de usar, sem necessidade de conhecimentos técnicos. Comece a vender em poucos minutos com nossa interface amigável.',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-white',
    iconBgColor: 'bg-indigo-600',
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="recursos" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Tudo que você precisa para vender online"
            description="Uma plataforma completa e intuitiva para gerenciar sua loja virtual"
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

