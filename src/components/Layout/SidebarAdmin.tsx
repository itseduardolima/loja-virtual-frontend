'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Shield, Users, CreditCard, Receipt, RotateCcw,
  Store, BarChart3, Ticket, Menu, X,
} from 'lucide-react'

interface SidebarAdminProps {
  currentPath?: string
}

const navigationItems = [
  { name: 'Dashboard',      href: '/admin',              icon: BarChart3 },
  { name: 'Usuários',       href: '/admin/usuarios',     icon: Users },
  { name: 'Planos',         href: '/admin/planos',       icon: CreditCard },
  { name: 'Cupons de Plano',href: '/admin/cupons-plano', icon: Ticket },
  { name: 'Assinaturas',    href: '/admin/assinaturas',  icon: Receipt },
  { name: 'Estornos',       href: '/admin/estornos',     icon: RotateCcw },
  { name: 'Lojas',          href: '/admin/lojas',        icon: Store },
]

function isActive(href: string, currentPath?: string): boolean {
  if (!currentPath) return false
  if (href === '/admin') return currentPath === '/admin'
  return currentPath.startsWith(href)
}

export function SidebarAdmin({ currentPath }: SidebarAdminProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-6 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-nxborder bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4 text-nxi2" /> : <Menu className="h-4 w-4 text-nxi2" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-nxsurf border-r border-nxborder',
        'transform transition-transform duration-200 ease-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:h-full',
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-nxborder px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-nxp/[0.09]">
              <Shield className="h-4 w-4 text-nxp" />
            </div>
            <div>
              <p className="font-integral text-[15px] font-bold uppercase tracking-wide text-nxi1">
                Admin
              </p>
              <p className="text-[11px] text-nxi3">Painel de Controle</p>
            </div>
          </div>
          <button
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg hover:bg-nxi3/[0.08]"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 text-nxi3" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3">
            Navegação
          </p>
          <div className="flex flex-col gap-0.5">
            {navigationItems.map((item) => {
              const active = isActive(item.href, currentPath)
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    active
                      ? 'border-l-2 border-nxp bg-nxp/[0.09] pl-[10px] text-nxp'
                      : 'border-l-2 border-transparent text-nxi2 hover:bg-nxi3/[0.08] hover:text-nxi1',
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                    active ? 'bg-nxp/10' : 'bg-transparent',
                  )}>
                    <Icon className="h-[15px] w-[15px]" />
                  </div>
                  <span className="text-[13px] font-medium">{item.name}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
