'use client'

import { useRouter } from 'next/navigation'
import {
  Home,
  BarChart3,
  ShoppingBag,
  Tag,
  Package,
  FolderOpen,
  HelpCircle,
  Settings,
  Crown,
  Store,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'
import { useMySubscription } from '@/hooks/useSubscription'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { FeatureLockedModal } from './FeatureLockedModal'
import {
  AppSidebar,
  SidebarStoreHeader,
  SidebarSection,
  SidebarPlanFooter,
  type NavItemDef,
  type NavSectionDef,
} from '@/components/Vendor/Sidebar'

interface SidebarVendedorProps {
  currentPath?: string
  pendingOrdersCount?: number
  pendingQuestionsCount?: number
}

export function SidebarVendedor({
  currentPath,
  pendingOrdersCount = 0,
  pendingQuestionsCount = 0,
}: SidebarVendedorProps) {
  const router = useRouter()
  const { data: store } = useStore()
  const { data: subscription } = useMySubscription()
  const { features } = usePlanFeatures()
  const { lockedFeature, showFeatureModal, closeFeatureModal } = useFeatureLockedModal()

  const sections: NavSectionDef[] = [
    {
      label: 'Visão geral',
      items: [
        { id: 'inicio', label: 'Início', href: '/vendedor', icon: Home },
        { id: 'dashboard', label: 'Dashboard', href: '/vendedor/dashboard', icon: BarChart3 },
      ],
    },
    {
      label: 'Vendas',
      items: [
        {
          id: 'pedidos',
          label: 'Pedidos',
          href: '/vendedor/pedidos',
          icon: ShoppingBag,
          badge:
            pendingOrdersCount > 0 ? { count: pendingOrdersCount, tone: 'danger' } : undefined,
        },
        {
          id: 'cupons',
          label: 'Cupons',
          href: '/vendedor/cupons',
          icon: Tag,
          requiresFeature: 'feature_coupons',
        },
      ],
    },
    {
      label: 'Catálogo',
      items: [
        { id: 'produtos', label: 'Produtos', href: '/vendedor/produtos', icon: Package },
        { id: 'categorias', label: 'Categorias', href: '/vendedor/categorias', icon: FolderOpen },
        { id: 'vitrine', label: 'Vitrine', href: '/vendedor/vitrine', icon: Store },
        {
          id: 'perguntas',
          label: 'Perguntas',
          href: '/vendedor/perguntas',
          icon: HelpCircle,
          requiresFeature: 'feature_product_questions',
          badge:
            pendingQuestionsCount > 0
              ? { count: pendingQuestionsCount, tone: 'warning' }
              : undefined,
        },
      ],
    },
    {
      label: 'Configurações',
      items: [
        { id: 'config', label: 'Configurações', href: '/vendedor/configuracoes', icon: Settings },
        { id: 'plano', label: 'Plano', href: '/vendedor/plano', icon: Crown },
      ],
    },
  ]

  const storeName = store?.name ?? 'Minha Loja'
  const storeSlug = store?.slug ?? ''
  const planName = subscription?.plan?.name ?? 'Profissional'

  function handleItemClick(item: NavItemDef) {
    if (item.requiresFeature && !features[item.requiresFeature]) {
      showFeatureModal(item.requiresFeature)
      return
    }
    router.push(item.href)
  }

  return (
    <>
      <AppSidebar
        header={(collapsed, onToggle) => (
          <SidebarStoreHeader
            storeName={storeName}
            logo={store?.logo}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        )}
        footer={
          subscription
            ? (collapsed) => (
                <SidebarPlanFooter
                  planName={planName}
                  status={subscription.status}
                  startDate={subscription.current_period_start}
                  endDate={subscription.current_period_end}
                  collapsed={collapsed}
                />
              )
            : undefined
        }
        extraNavContent={
          storeSlug
            ? (collapsed) => (
                <SidebarSection label="Loja" collapsed={collapsed}>
                  <a
                    href={`/loja/${storeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={collapsed ? 'Ver minha loja' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-[10px] border-none text-[13.5px] font-medium text-nxi2 no-underline transition-colors hover:bg-nxi3/[0.08]',
                      collapsed ? 'justify-center py-2.5' : 'justify-start px-2.5 py-2.5',
                    )}
                  >
                    <Store size={17} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">Ver minha loja</span>
                        <ExternalLink size={12} className="shrink-0 text-nxi3" />
                      </>
                    )}
                  </a>
                </SidebarSection>
              )
            : undefined
        }
        sections={sections}
        currentPath={currentPath}
        collapsedStorageKey="sidebar-collapsed"
        isItemLocked={(item) => !!(item.requiresFeature && !features[item.requiresFeature])}
        onItemClick={handleItemClick}
      />

      <FeatureLockedModal
        feature={lockedFeature}
        open={!!lockedFeature}
        onOpenChange={(open) => !open && closeFeatureModal()}
      />
    </>
  )
}
