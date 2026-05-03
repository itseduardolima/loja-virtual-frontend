'use client'

import { useState, useEffect } from 'react'
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
import { useMySubscription } from '@/hooks/useMySubscription'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { FeatureLockedModal } from './FeatureLockedModal'
import {
  SidebarStoreHeader,
  SidebarSection,
  SidebarNavItem,
  SidebarPlanFooter,
  type NavItemDef,
  type NavSectionDef,
} from '@/components/Vendor/Sidebar'

interface SidebarVendedorProps {
  currentPath?: string
  pendingOrdersCount?: number
  pendingQuestionsCount?: number
}

const COLLAPSED_KEY = 'sidebar-collapsed'

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

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(COLLAPSED_KEY) === 'true'
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

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
        {
          id: 'config',
          label: 'Configurações',
          href: '/vendedor/configuracoes/informacoes-basicas',
          icon: Settings,
        },
        { id: 'plano', label: 'Plano', href: '/vendedor/plano', icon: Crown },
      ],
    },
  ]

  function isActive(item: NavItemDef) {
    if (item.href === '/vendedor') return currentPath === '/vendedor'
    return currentPath?.startsWith(item.href) ?? false
  }

  function handleNav(item: NavItemDef) {
    if (item.requiresFeature && !features[item.requiresFeature]) {
      showFeatureModal(item.requiresFeature)
      return
    }
    router.push(item.href)
  }

  const storeName = store?.name ?? 'Minha Loja'
  const storeSlug = store?.slug ?? ''
  const planName = subscription?.plan?.name ?? 'Profissional'

  return (
    <>
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col overflow-hidden border-r border-nxborder bg-nxsurf',
          'transition-[width,min-width] duration-200 ease-out',
          collapsed ? 'w-[72px] min-w-[72px]' : 'w-[248px] min-w-[248px]',
        )}
      >
        <SidebarStoreHeader
          storeName={storeName}
          logo={store?.logo}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
          {sections.map((section) => (
            <SidebarSection key={section.label} label={section.label} collapsed={collapsed}>
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  active={isActive(item)}
                  locked={!!(item.requiresFeature && !features[item.requiresFeature])}
                  collapsed={collapsed}
                  onClick={() => handleNav(item)}
                />
              ))}
            </SidebarSection>
          ))}

          {storeSlug && (
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
          )}
        </nav>

        {subscription && (
          <SidebarPlanFooter
            planName={planName}
            status={subscription.status}
            startDate={subscription.current_period_start}
            endDate={subscription.current_period_end}
            collapsed={collapsed}
          />
        )}
      </aside>

      <FeatureLockedModal
        feature={lockedFeature}
        open={!!lockedFeature}
        onOpenChange={(open) => !open && closeFeatureModal()}
      />
    </>
  )
}
