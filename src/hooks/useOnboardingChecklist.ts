'use client'

import { useStore } from '@/hooks/useStore'
import { useDashboard } from '@/hooks/useDashboard'
import { useBlingStatus } from '@/hooks/useBlingStatus'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import type { CheckItem } from '@/components/Vendor/Home/Checklist'

interface OnboardingResult {
  items: CheckItem[]
  doneCount: number
  totalCount: number
}

export function useOnboardingChecklist(): OnboardingResult {
  const { data: store } = useStore()
  const { summary } = useDashboard()
  const { features } = usePlanFeatures()
  const blingAvailable = features.feature_bling_integration
  const { data: blingStatus } = useBlingStatus(blingAvailable)

  const s = (store ?? {}) as any

  const rawItems: Omit<CheckItem, 'primary'>[] = [
    {
      id: 'logo',
      text: 'Adicione a logo da loja',
      done: !!s.logo,
      cta: 'Adicionar',
      href: '/vendedor/configuracoes/informacoes-basicas',
    },
    {
      id: 'banner',
      text: 'Personalize o banner da loja',
      done: !!s.banner,
      cta: 'Personalizar',
      href: '/vendedor/configuracoes/informacoes-basicas',
    },
    {
      id: 'description',
      text: 'Escreva uma descrição para a loja',
      done: !!s.description && String(s.description).trim().length > 0,
      cta: 'Escrever',
      href: '/vendedor/configuracoes/informacoes-basicas',
    },
    {
      id: 'address',
      text: 'Informe o endereço da loja',
      done: !!s.zipcode && !!s.city && !!s.state,
      cta: 'Preencher',
      href: '/vendedor/configuracoes/endereco',
    },
    {
      id: 'contacts',
      text: 'Conecte um canal de contato (WhatsApp, Instagram…)',
      done: !!(s.whatsapp || s.instagram || s.facebook || s.email || s.phone),
      cta: 'Conectar',
      href: '/vendedor/configuracoes/contatos',
    },
    {
      id: 'documents',
      text: 'Cadastre o CNPJ da loja',
      done: !!s.cnpj,
      cta: 'Cadastrar',
      href: '/vendedor/configuracoes/documentos',
    },
    {
      id: 'hours',
      text: 'Defina o horário de funcionamento',
      done: !!s.business_hours && Object.keys(s.business_hours).length > 0,
      cta: 'Definir',
      href: '/vendedor/configuracoes/horario',
    },
    {
      id: 'delivery',
      text: 'Configure as opções de entrega',
      done: s.delivery_fee !== undefined && s.delivery_fee !== null && s.delivery_fee !== '',
      cta: 'Configurar',
      href: '/vendedor/configuracoes/entrega',
    },
    {
      id: 'payment',
      text: 'Configure formas de pagamento',
      done: Array.isArray(s.payment_methods) && s.payment_methods.length > 0,
      cta: 'Configurar',
      href: '/vendedor/configuracoes/pagamento',
    },
    {
      id: 'categories',
      text: 'Crie categorias para organizar seus produtos',
      done: Array.isArray(s.categories) && s.categories.length > 0,
      cta: 'Criar',
      href: '/vendedor/categorias',
    },
    {
      id: 'product',
      text: 'Cadastre seu primeiro produto',
      done: (summary?.products?.total ?? 0) > 0,
      cta: 'Criar produto',
      href: '/vendedor/produtos/criar',
    },
    ...(blingAvailable
      ? [
          {
            id: 'bling',
            text: 'Conecte o Bling para sincronizar estoque',
            done: !!blingStatus?.connected,
            cta: 'Conectar',
            href: '/vendedor/configuracoes/integracao-bling',
          },
        ]
      : []),
  ]

  const firstPendingId = rawItems.find((i) => !i.done)?.id
  const items: CheckItem[] = rawItems.map((i) => ({
    ...i,
    primary: i.id === firstPendingId,
  }))

  const doneCount = items.filter((i) => i.done).length

  return { items, doneCount, totalCount: items.length }
}
