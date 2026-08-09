'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, Receipt, ShoppingBag, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useDashboard, type DashboardComparison } from '@/hooks/useDashboard'
import { useOnboardingChecklist } from './useOnboardingChecklist'
import { usePendingQuestionsCount } from '@/hooks/usePendingQuestionsCount'
import {
  formatBRL,
  formatTodayLabel,
  getGreeting,
  kpiDeltaProps,
  type DeltaSource,
} from '@/lib/vendor'

function ticketAverageDelta(cmp?: DashboardComparison): DeltaSource | undefined {
  if (!cmp) return undefined
  const cur = cmp.orders.current > 0 ? cmp.revenue.current / cmp.orders.current : 0
  const prev = cmp.orders.previous > 0 ? cmp.revenue.previous / cmp.orders.previous : 0
  const delta = cur - prev
  const dir: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  return { delta, dir }
}

export function useVendedorPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: store, isLoading: storeLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { summary, isLoading: dashLoading } = useDashboard()
  const { data: pendingQuestionsCount = 0 } = usePendingQuestionsCount()
  const { items: checkItems } = useOnboardingChecklist()

  // Estados para upload de imagens
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  // Estados para edição de contatos
  const [isEditingContacts, setIsEditingContacts] = useState(false)
  const [contactForm, setContactForm] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    website: '',
    email: '',
    phone: ''
  })

  // Refs para os inputs de arquivo
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Guard: redireciona para criar-loja se vendedor sem loja
  useEffect(() => {
    if (!authLoading && !storeLoading && user?.profile === 'Vendedor' && !store) {
      router.push('/vendedor/criar-loja')
    }
  }, [authLoading, storeLoading, user, store, router])

  // Dados derivados do dashboard
  const ticketDelta = useMemo(() => ticketAverageDelta(summary?.comparison), [summary])

  const greeting = getGreeting(user?.name ?? '')
  const todayLabel = formatTodayLabel()

  const pendingOrders = summary?.orders?.pending ?? 0
  const todayRevenue = summary?.today?.revenue ?? 0
  const todayOrders = summary?.today?.orders ?? 0
  const ticketAvg = todayOrders > 0 ? todayRevenue / todayOrders : 0
  const conversionRate = summary?.cart_conversion?.conversion_rate ?? 0
  const hasConversionData = (summary?.cart_conversion?.total_sessions ?? 0) > 0
  const conversionValue = hasConversionData
    ? `${conversionRate.toFixed(1).replace('.', ',')}%`
    : '—'

  const cmp = summary?.comparison
  const revenueProps = kpiDeltaProps(cmp?.revenue, 'currency')
  const ordersProps = kpiDeltaProps(cmp?.orders, 'count', 'pedido')
  const ticketProps = kpiDeltaProps(ticketDelta, 'currency')
  const conversionProps = hasConversionData
    ? kpiDeltaProps(cmp?.conversion, 'percentPoints')
    : { delta: undefined, deltaDir: 'up' as const }

  const kpiCards = [
    {
      label: 'Receita hoje',
      value: formatBRL(todayRevenue),
      icon: TrendingUp,
      tone: 'primary' as const,
      ...revenueProps,
    },
    {
      label: 'Pedidos hoje',
      value: String(todayOrders),
      icon: ShoppingBag,
      tone: 'accent' as const,
      ...ordersProps,
    },
    {
      label: 'Ticket médio',
      value: formatBRL(ticketAvg),
      icon: Receipt,
      tone: 'warning' as const,
      ...ticketProps,
    },
    {
      label: 'Conversão do carrinho',
      value: conversionValue,
      icon: BarChart2,
      tone: 'success' as const,
      ...conversionProps,
    },
  ]

  // Função para lidar com upload do banner
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !store?.id) return

    setIsUploadingBanner(true)
    try {
      await updateStore({
        storeId: store.id,
        data: { banner: file }
      })
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
    } finally {
      setIsUploadingBanner(false)
    }
  }

  // Função para lidar com upload do logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !store?.id) return

    setIsUploadingLogo(true)
    try {
      await updateStore({
        storeId: store.id,
        data: { logo: file }
      })
    } catch (error) {
      console.error('Erro ao atualizar logo:', error)
    } finally {
      setIsUploadingLogo(false)
    }
  }

  // Função para iniciar edição de contatos
  const startEditingContacts = () => {
    setContactForm({
      whatsapp: store?.whatsapp || '',
      instagram: store?.instagram || '',
      facebook: store?.facebook || '',
      website: store?.website || '',
      email: store?.email || '',
      phone: store?.phone || ''
    })
    setIsEditingContacts(true)
  }

  // Função para cancelar edição de contatos
  const cancelEditingContacts = () => {
    setIsEditingContacts(false)
    setContactForm({
      whatsapp: '',
      instagram: '',
      facebook: '',
      website: '',
      email: '',
      phone: ''
    })
  }

  // Função para salvar contatos
  const saveContacts = async () => {
    if (!store?.id) return

    try {
      await updateStore({
        storeId: store.id,
        data: contactForm
      })
      setIsEditingContacts(false)
    } catch (error) {
      console.error('Erro ao atualizar contatos:', error)
    }
  }

  return {
    // Loading / guard state
    isLoading: authLoading || storeLoading || !store,
    dashLoading,
    // User / store
    user,
    store,
    hasWhatsapp: !!store?.whatsapp,
    isUpdating,
    // Dashboard KPI data
    greeting,
    todayLabel,
    pendingOrders,
    pendingQuestionsCount,
    kpiCards,
    checkItems,
    // Image upload
    isUploadingBanner,
    isUploadingLogo,
    bannerInputRef,
    logoInputRef,
    handleBannerUpload,
    handleLogoUpload,
    // Contacts
    isEditingContacts,
    setIsEditingContacts,
    contactForm,
    setContactForm,
    startEditingContacts,
    cancelEditingContacts,
    saveContacts,
  }
}
