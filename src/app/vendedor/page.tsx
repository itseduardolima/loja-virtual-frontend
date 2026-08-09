'use client'

import Link from 'next/link'
import { LoadingPage } from '@/components/Layout'
import { Checklist, HomeGreeting, KpiCard, StoreCard } from '@/components'
import { Notice } from './configuracoes/_shared'
import { useVendedorPage } from './useVendedorPage'

export default function VendedorPage() {
  const {
    isLoading,
    dashLoading,
    greeting,
    todayLabel,
    pendingOrders,
    pendingQuestionsCount,
    kpiCards,
    checkItems,
    hasWhatsapp,
  } = useVendedorPage()

  if (isLoading) return <LoadingPage />

  return (
    <div className="flex flex-col gap-5">
      <HomeGreeting
        greetingText={greeting.text}
        period={greeting.period}
        todayLabel={todayLabel}
        pendingOrders={pendingOrders}
        pendingQuestions={pendingQuestionsCount}
        isLoading={dashLoading}
      />

      {!hasWhatsapp && (
        <Notice variant="amber">
          Sua loja ainda não tem um <strong>WhatsApp</strong> cadastrado. É por esse canal que os
          compradores falam com você depois da compra para combinar pagamento e entrega — cadastre um
          número em{' '}
          <Link href="/vendedor/configuracoes/contatos" className="font-bold underline underline-offset-2">
            Configurações → Contatos
          </Link>{' '}
          para não perder vendas.
        </Notice>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpiCards.map((card) => (
              <KpiCard key={card.label} {...card} />
            ))}
          </div>

          <Checklist items={checkItems} />
        </div>

        <StoreCard />
      </div>
    </div>
  )
}
