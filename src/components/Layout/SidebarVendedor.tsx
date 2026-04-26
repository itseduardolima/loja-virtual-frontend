'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Store,
  Package,
  Tag,
  FileText,
  Menu,
  X,
  BarChart3,
  Home,
  CreditCard,
  MessageCircle,
  Plug,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '@/hooks/useStore'
import { usePlanFeatures, type PlanFeatures } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { FeatureLockedModal } from './FeatureLockedModal'

interface SidebarVendedorProps {
  currentPath?: string
}

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  current: boolean | undefined
  requiresFeature?: keyof PlanFeatures
}

export function SidebarVendedor({ currentPath }: SidebarVendedorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { data: store } = useStore()
  const { features } = usePlanFeatures()
  const { lockedFeature, showFeatureModal, closeFeatureModal } = useFeatureLockedModal()

  const navigationItems: NavItem[] = [
    {
      name: 'Home',
      href: '/vendedor',
      icon: Home,
      current: currentPath === '/vendedor',
    },
    {
      name: 'Dashboard',
      href: '/vendedor/dashboard',
      icon: BarChart3,
      current: currentPath?.startsWith('/vendedor/dashboard'),
    },
    {
      name: 'Produtos',
      href: '/vendedor/produtos',
      icon: Package,
      current: currentPath?.startsWith('/vendedor/produtos'),
    },
    {
      name: 'Categorias',
      href: '/vendedor/categorias',
      icon: Tag,
      current: currentPath?.startsWith('/vendedor/categorias'),
    },
    {
      name: 'Pedidos',
      href: '/vendedor/pedidos',
      icon: FileText,
      current: currentPath?.startsWith('/vendedor/pedidos'),
    },
    {
      name: 'Cupons',
      href: '/vendedor/cupons',
      icon: Tag,
      current: currentPath?.startsWith('/vendedor/cupons'),
      requiresFeature: 'feature_coupons',
    },
    {
      name: 'Perguntas',
      href: '/vendedor/perguntas',
      icon: MessageCircle,
      current: currentPath?.startsWith('/vendedor/perguntas'),
      requiresFeature: 'feature_product_questions',
    },
    {
      name: 'Meu Plano',
      href: '/vendedor/plano',
      icon: CreditCard,
      current: currentPath?.startsWith('/vendedor/plano'),
    },
    {
      name: 'Integrações',
      href: '/vendedor/configuracoes/integracao-bling',
      icon: Plug,
      current: currentPath?.startsWith('/vendedor/configuracoes/integracao-bling'),
      requiresFeature: 'feature_bling_integration',
    },
    {
      name: 'Ver minha loja',
      href: store?.slug ? `/loja/${store.slug}` : '#',
      icon: Store,
      current: currentPath?.startsWith(store?.slug ? `/loja/${store.slug}/produtos` : '#'),
    },
  ]

  const handleNavigation = (item: NavItem) => {
    if (item.requiresFeature && !features[item.requiresFeature]) {
      showFeatureModal(item.requiresFeature)
      return
    }
    router.push(item.href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-7 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:h-full
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 uppercase font-integral">Vendedor</h1>
                <p className="text-sm text-gray-600">Painel de Controle</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isLocked = !!item.requiresFeature && !features[item.requiresFeature]
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${item.current
                      ? 'bg-primary text-white border border-primary'
                      : isLocked
                        ? 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium flex-1">{item.name}</span>
                  {isLocked && (
                    <Lock className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-label="Bloqueado" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <FeatureLockedModal
        feature={lockedFeature}
        open={!!lockedFeature}
        onOpenChange={(open) => !open && closeFeatureModal()}
      />
    </>
  )
}
