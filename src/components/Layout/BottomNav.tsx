'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  BarChart3,
  ShoppingBag,
  Package,
  Menu,
  Tag,
  FolderOpen,
  HelpCircle,
  Settings,
  Crown,
  ExternalLink,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useStore } from '@/hooks/useStore'
import { usePlanFeatures, type PlanFeatureKey } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { FeatureLockedModal } from './FeatureLockedModal'

interface BottomNavProps {
  currentPath: string
  pendingOrdersCount?: number
  pendingQuestionsCount?: number
}

const MAIN_TABS = [
  { id: 'inicio', label: 'Início', href: '/vendedor', icon: Home },
  { id: 'pedidos', label: 'Pedidos', href: '/vendedor/pedidos', icon: ShoppingBag },
  { id: 'produtos', label: 'Produtos', href: '/vendedor/produtos', icon: Package },
  { id: 'dashboard', label: 'Dashboard', href: '/vendedor/dashboard', icon: BarChart3 },
]

const MORE_ITEMS = [
  { id: 'cupons', label: 'Cupons', href: '/vendedor/cupons', icon: Tag, requiresFeature: 'feature_coupons' as PlanFeatureKey },
  { id: 'categorias', label: 'Categorias', href: '/vendedor/categorias', icon: FolderOpen, requiresFeature: undefined },
  { id: 'perguntas', label: 'Perguntas', href: '/vendedor/perguntas', icon: HelpCircle, requiresFeature: 'feature_product_questions' as PlanFeatureKey, hasBadge: true },
  { id: 'config', label: 'Configurações', href: '/vendedor/configuracoes', icon: Settings, requiresFeature: undefined },
  { id: 'plano', label: 'Plano', href: '/vendedor/plano', icon: Crown, requiresFeature: undefined },
]

function isActive(href: string, currentPath: string) {
  if (href === '/vendedor') return currentPath === '/vendedor'
  return currentPath.startsWith(href)
}

export function BottomNav({ currentPath, pendingOrdersCount = 0, pendingQuestionsCount = 0 }: BottomNavProps) {
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)
  const { data: store } = useStore()
  const { features } = usePlanFeatures()
  const { lockedFeature, showFeatureModal, closeFeatureModal } = useFeatureLockedModal()

  const storeSlug = store?.slug ?? ''
  const moreIsActive = MORE_ITEMS.some((item) => isActive(item.href, currentPath))

  function handleMainTab(href: string) {
    router.push(href)
  }

  function handleMoreItem(item: (typeof MORE_ITEMS)[number]) {
    if (item.requiresFeature && !features[item.requiresFeature]) {
      showFeatureModal(item.requiresFeature)
      return
    }
    setMoreOpen(false)
    router.push(item.href)
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-[64px] items-stretch border-t border-nxborder bg-white shadow-[0_-4px_16px_rgba(28,30,43,0.07)] pb-[env(safe-area-inset-bottom,0px)]">
        {MAIN_TABS.map((tab) => {
          const active = isActive(tab.href, currentPath)
          const showBadge = tab.id === 'pedidos' && pendingOrdersCount > 0
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleMainTab(tab.href)}
              className="flex flex-1 flex-col items-center justify-center gap-[3px]"
            >
              <span className="relative flex h-8 w-10 items-center justify-center rounded-full transition-colors">
                {active && <span className="absolute inset-0 rounded-full bg-[#EEF0FB]" />}
                <tab.icon
                  size={22}
                  className={cn('relative z-10', active ? 'text-nxp' : 'text-nxi3')}
                />
                {showBadge && (
                  <span className="absolute -right-[2px] -top-[2px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-nxd px-[4px] text-[10px] font-extrabold leading-none text-white">
                    {pendingOrdersCount > 9 ? '9+' : pendingOrdersCount}
                  </span>
                )}
              </span>
              <span className={cn('text-[10px] font-bold', active ? 'text-nxp' : 'text-nxi3')}>
                {tab.label}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-[3px]"
        >
          <span className="relative flex h-8 w-10 items-center justify-center rounded-full transition-colors">
            {moreIsActive && <span className="absolute inset-0 rounded-full bg-[#EEF0FB]" />}
            <Menu
              size={22}
              className={cn('relative z-10', moreIsActive ? 'text-nxp' : 'text-nxi3')}
            />
          </span>
          <span className={cn('text-[10px] font-bold', moreIsActive ? 'text-nxp' : 'text-nxi3')}>
            Mais
          </span>
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-[20px] p-0 lg:hidden">
          <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-nxborder" />
          <p className="mb-1 px-5 text-[16px] font-extrabold text-nxi1">Menu</p>
          <div>
            {MORE_ITEMS.map((item, idx) => {
              const active = isActive(item.href, currentPath)
              const locked = !!(item.requiresFeature && !features[item.requiresFeature])
              const badge = item.hasBadge && pendingQuestionsCount > 0 ? pendingQuestionsCount : 0
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMoreItem(item)}
                  className={cn(
                    'flex w-full items-center gap-3 px-5 py-[14px] transition-colors',
                    idx > 0 && 'border-t border-nxborder',
                    active ? 'bg-[#EEF0FB]' : 'bg-white',
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(active ? 'text-nxp' : locked ? 'text-nxi3' : 'text-nxi2')}
                  />
                  <span
                    className={cn(
                      'flex-1 text-left text-[15px]',
                      active ? 'font-bold text-nxp' : locked ? 'font-semibold text-nxi3' : 'font-semibold text-nxi1',
                    )}
                  >
                    {item.label}
                  </span>
                  {badge > 0 && (
                    <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-nxw px-[5px] text-[11px] font-extrabold text-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                  {locked && <Lock size={14} className="text-nxi3" />}
                </button>
              )
            })}
          </div>

          {storeSlug && (
            <a
              href={`/loja/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-3 border-t border-nxborder px-5 py-4 text-[15px] font-bold text-nxp no-underline"
            >
              <ExternalLink size={20} className="text-nxp" />
              Ver minha loja
            </a>
          )}
        </SheetContent>
      </Sheet>

      <FeatureLockedModal
        feature={lockedFeature}
        open={!!lockedFeature}
        onOpenChange={(open) => !open && closeFeatureModal()}
      />
    </>
  )
}
