'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  User,
  MapPin,
  CreditCard,
  Truck,
  ChevronRight,
  X,
  LogOut,
  Store,
  Phone,
  FileText,
  Clock,
  Bell,
  ShoppingCart,
  CheckCheck,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { OrderNotification } from '@/hooks/useOrderNotifications'

interface UserHeaderProps {
  currentPath?: string
  notifications?: OrderNotification[]
  onMarkAllAsRead?: () => void
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
  onClearAll?: () => void
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export function UserHeader({
  currentPath,
  notifications = [],
  onMarkAllAsRead,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}: UserHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNotificationClick = (notif: OrderNotification) => {
    onMarkAsRead?.(notif.id)
    setIsNotifOpen(false)
    if (notif.orderId) {
      router.push(`/vendedor/pedidos?orderId=${notif.orderId}`)
    } else {
      router.push('/vendedor/pedidos')
    }
  }

  const handleGoToOrders = () => {
    setIsNotifOpen(false)
    router.push('/vendedor/pedidos')
  }

  const configItems = [
    {
      name: 'Informações Básicas',
      href: '/vendedor/configuracoes/informacoes-basicas',
      icon: Store,
      current: currentPath?.startsWith('/vendedor/configuracoes/informacoes-basicas'),
    },
    {
      name: 'Contatos',
      href: '/vendedor/configuracoes/contatos',
      icon: Phone,
      current: currentPath?.startsWith('/vendedor/configuracoes/contatos'),
    },
    {
      name: 'Documentos',
      href: '/vendedor/configuracoes/documentos',
      icon: FileText,
      current: currentPath?.startsWith('/vendedor/configuracoes/documentos'),
    },
    {
      name: 'Endereço',
      href: '/vendedor/configuracoes/endereco',
      icon: MapPin,
      current: currentPath?.startsWith('/vendedor/configuracoes/endereco'),
    },
    {
      name: 'Pagamento',
      href: '/vendedor/configuracoes/pagamento',
      icon: CreditCard,
      current: currentPath?.startsWith('/vendedor/configuracoes/pagamento'),
    },
    {
      name: 'Entrega',
      href: '/vendedor/configuracoes/entrega',
      icon: Truck,
      current: currentPath?.startsWith('/vendedor/configuracoes/entrega'),
    },
    {
      name: 'Horário',
      href: '/vendedor/configuracoes/horario',
      icon: Clock,
      current: currentPath?.startsWith('/vendedor/configuracoes/horario'),
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsDrawerOpen(false)
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-end items-center gap-2 px-6 py-[14px] bg-white border-b border-gray-200">
        {/* Sino de notificações */}
        <Popover open={isNotifOpen} onOpenChange={setIsNotifOpen}>
          <PopoverTrigger asChild>
            <button
              className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
              title="Notificações de pedidos"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold leading-none animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
            {/* Header do painel */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-900 text-sm">Notificações</span>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllAsRead}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                        title="Marcar todas como lidas"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={onClearAll}
                      className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
                      title="Limpar todas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Bell className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">Nenhuma notificação</p>
                  <p className="text-xs mt-1">Novos pedidos aparecerão aqui</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors cursor-pointer hover:bg-gray-50 ${
                      notif.read ? 'bg-white' : 'bg-blue-50/50 hover:bg-blue-50'
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${
                      notif.read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      <ShoppingCart className={`h-3.5 w-3.5 ${notif.read ? 'text-gray-500' : 'text-blue-600'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-gray-900">
                          Pedido #{notif.orderCode}
                        </span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {notif.customerName}
                      </p>
                      <p className="text-xs font-semibold text-green-600 mt-0.5">
                        R$ {notif.total.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{timeAgo(notif.timestamp)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDismiss?.(notif.id) }}
                        className="p-0.5 rounded hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-600"
                        title="Remover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  onClick={handleGoToOrders}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver todos os pedidos
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Avatar / configurações */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-text-gray">{user?.profile}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-50"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)} className="p-2">
              <X className="h-5 w-5 text-text-gray" />
            </Button>
          </div>

          <div className="pb-6 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-text-gray">{user?.profile}</p>
              </div>
            </div>
          </div>

          {user?.profile !== 'Administrador' && (
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
          )}

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
