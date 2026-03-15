'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, Users, CreditCard, Receipt, RotateCcw, Store, BarChart3, Menu, X } from 'lucide-react'

interface SidebarAdminProps {
  currentPath?: string
}

export function SidebarAdmin({ currentPath }: SidebarAdminProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: currentPath === '/admin' },
    { name: 'Usuários', href: '/admin/usuarios', icon: Users, current: currentPath?.startsWith('/admin/usuarios') },
    { name: 'Planos', href: '/admin/planos', icon: CreditCard, current: currentPath?.startsWith('/admin/planos') },
    { name: 'Assinaturas', href: '/admin/assinaturas', icon: Receipt, current: currentPath?.startsWith('/admin/assinaturas') },
    { name: 'Estornos', href: '/admin/estornos', icon: RotateCcw, current: currentPath?.startsWith('/admin/estornos') },
    { name: 'Lojas', href: '/admin/lojas', icon: Store, current: currentPath?.startsWith('/admin/lojas') },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      <div className="lg:hidden fixed top-7 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="rounded-lg">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/10 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:h-full
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 uppercase font-integral">Admin</h1>
                <p className="text-sm text-gray-600">Painel de Controle</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${item.current
                      ? 'bg-primary text-white border border-primary'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
