'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  Store,
  Receipt,
  RotateCcw,
  CreditCard,
  Ticket,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface BottomNavAdminProps {
  currentPath: string
}

const MAIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { id: 'usuarios', label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { id: 'lojas', label: 'Lojas', href: '/admin/lojas', icon: Store },
  { id: 'assinaturas', label: 'Assinaturas', href: '/admin/assinaturas', icon: Receipt },
]

const MORE_ITEMS = [
  { id: 'estornos', label: 'Estornos', href: '/admin/estornos', icon: RotateCcw },
  { id: 'planos', label: 'Planos', href: '/admin/planos', icon: CreditCard },
  { id: 'cupons-plano', label: 'Cupons de Plano', href: '/admin/cupons-plano', icon: Ticket },
]

function isActive(href: string, currentPath: string) {
  if (href === '/admin') return currentPath === '/admin'
  return currentPath.startsWith(href)
}

export function BottomNavAdmin({ currentPath }: BottomNavAdminProps) {
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreIsActive = MORE_ITEMS.some((item) => isActive(item.href, currentPath))

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-[64px] items-stretch border-t border-nxborder bg-white shadow-[0_-4px_16px_rgba(28,30,43,0.07)] pb-[env(safe-area-inset-bottom,0px)]">
        {MAIN_TABS.map((tab) => {
          const active = isActive(tab.href, currentPath)
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => router.push(tab.href)}
              className="flex flex-1 flex-col items-center justify-center gap-[3px]"
            >
              <span className="relative flex h-8 w-10 items-center justify-center rounded-full transition-colors">
                {active && <span className="absolute inset-0 rounded-full bg-[#EEF0FB]" />}
                <tab.icon
                  size={22}
                  className={cn('relative z-10', active ? 'text-nxp' : 'text-nxi3')}
                />
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
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMoreOpen(false)
                    router.push(item.href)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-5 py-[14px] transition-colors',
                    idx > 0 && 'border-t border-nxborder',
                    active ? 'bg-[#EEF0FB]' : 'bg-white',
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(active ? 'text-nxp' : 'text-nxi2')}
                  />
                  <span
                    className={cn(
                      'flex-1 text-left text-[15px]',
                      active ? 'font-bold text-nxp' : 'font-semibold text-nxi1',
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
