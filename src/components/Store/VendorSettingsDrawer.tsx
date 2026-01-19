'use client'

import { useRouter, usePathname } from 'next/navigation'
import { X, User, MapPin, CreditCard, Truck, LogOut, Store, Phone, FileText, Clock, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface VendorSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function VendorSettingsDrawer({ isOpen, onClose }: VendorSettingsDrawerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
    onClose()
  }

  const configItems = [
    {
      name: 'Informações Básicas',
      href: '/vendedor/configuracoes/informacoes-basicas',
      icon: Store,
      current: pathname?.startsWith('/vendedor/configuracoes/informacoes-basicas')
    },
    {
      name: 'Contatos',
      href: '/vendedor/configuracoes/contatos',
      icon: Phone,
      current: pathname?.startsWith('/vendedor/configuracoes/contatos')
    },
    {
      name: 'Documentos',
      href: '/vendedor/configuracoes/documentos',
      icon: FileText,
      current: pathname?.startsWith('/vendedor/configuracoes/documentos')
    },
    {
      name: 'Endereço',
      href: '/vendedor/configuracoes/endereco',
      icon: MapPin,
      current: pathname?.startsWith('/vendedor/configuracoes/endereco')
    },
    {
      name: 'Pagamento',
      href: '/vendedor/configuracoes/pagamento',
      icon: CreditCard,
      current: pathname?.startsWith('/vendedor/configuracoes/pagamento')
    },
    {
      name: 'Entrega',
      href: '/vendedor/configuracoes/entrega',
      icon: Truck,
      current: pathname?.startsWith('/vendedor/configuracoes/entrega')
    },
    {
      name: 'Horário',
      href: '/vendedor/configuracoes/horario',
      icon: Clock,
      current: pathname?.startsWith('/vendedor/configuracoes/horario')
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Configurações</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500">Vendedor</p>
              </div>
            </div>
          </div>

          {/* Painel de Controle */}
          <div className="p-4 border-b border-gray-200">
            <Button
              onClick={() => handleNavigation('/vendedor')}
              className="w-full flex items-center gap-3 h-12 bg-primary hover:bg-primary/90 text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">Painel de Controle</span>
            </Button>
          </div>

          {/* Configurações */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Configurações da Loja
            </h3>
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
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
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
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

