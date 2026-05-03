'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell, ShoppingCart, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/vendor'
import type { OrderNotification } from '@/hooks/useOrderNotifications'

interface NotificationsPopoverProps {
  notifications: OrderNotification[]
  onMarkAllAsRead?: () => void
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
  onClearAll?: () => void
}

export function NotificationsPopover({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}: NotificationsPopoverProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotifClick = (notif: OrderNotification) => {
    onMarkAsRead?.(notif.id)
    setIsOpen(false)
    router.push(notif.orderId ? `/vendedor/pedidos?orderId=${notif.orderId}` : '/vendedor/pedidos')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notificações"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-nxborder bg-white text-nxi2"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-nxsurf bg-nxd px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Notificações</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClearAll}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Bell className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm font-medium">Nenhuma notificação</p>
              <p className="mt-1 text-xs">Novos pedidos aparecerão aqui</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50',
                  notif.read ? 'bg-white' : 'bg-blue-50/50 hover:bg-blue-50',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 shrink-0 rounded-full p-2',
                    notif.read ? 'bg-gray-100' : 'bg-blue-100',
                  )}
                >
                  <ShoppingCart
                    className={cn(
                      'h-3.5 w-3.5',
                      notif.read ? 'text-gray-500' : 'text-blue-600',
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      Pedido #{notif.orderCode}
                    </span>
                    {!notif.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{notif.customerName}</p>
                  <p className="mt-0.5 text-xs font-semibold text-green-600">
                    R$ {notif.total.toFixed(2)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">{timeAgo(notif.timestamp)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDismiss?.(notif.id)
                    }}
                    className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/vendedor/pedidos')
              }}
              className="flex w-full items-center justify-center gap-2 text-sm font-medium text-nxp hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver todos os pedidos
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
