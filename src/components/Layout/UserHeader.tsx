'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  User,
  MapPin,
  CreditCard,
  Truck,
  ChevronRight,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface UserHeaderProps {
  currentPath?: string
}

export function UserHeader({ currentPath }: UserHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const configItems = [
    {
      name: 'Endereço',
      href: '/vendedor/configuracoes/endereco',
      icon: MapPin,
      current: currentPath?.startsWith('/vendedor/configuracoes/endereco')
    },
    {
      name: 'Pagamento',
      href: '/vendedor/configuracoes/pagamento',
      icon: CreditCard,
      current: currentPath?.startsWith('/vendedor/configuracoes/pagamento')
    },
    {
      name: 'Entrega',
      href: '/vendedor/configuracoes/entrega',
      icon: Truck,
      current: currentPath?.startsWith('/vendedor/configuracoes/entrega')
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsDrawerOpen(false)
  }

  return (
    <>
      {/* Header com Avatar */}
      <div className="flex justify-end items-center px-6 py-[14px] bg-white border-b border-gray-200">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-text-gray">Vendedor</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-primary bg-opacity-50 z-50"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2"
            >
              <X className="h-5 w-5 text-text-gray" />
            </Button>
          </div>

          {/* User Info */}
          <div className="pb-6 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-text-gray">Vendedor</p>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="flex-1 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Configurações da Loja</h3>
            <div className="space-y-2">
              {configItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${item.current
                        ? 'bg-primary text-primary-foreground border border-secondary'
                        : 'text-text-gray hover:bg-secondary hover:text-primary'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>

                  </button>
                )
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="p-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
