'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell, BellOff, ShoppingBag, CheckCheck, Trash2, X, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/vendor'
import type { OrderNotification } from '@/hooks/useOrderNotifications'

interface NotificationsPopoverProps {
  notifications: OrderNotification[]
  isLoading?: boolean
  onMarkAllAsRead?: () => void
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
  onClearAll?: () => void
}

function brl(n: number) {
  return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function SkeletonRow({ w1, w2 }: { w1: string; w2: string }) {
  return (
    <div className="flex gap-[11px] border-b border-[#F1F2F7] px-[16px] py-[13px]">
      <div className="h-[36px] w-[36px] flex-none animate-pulse rounded-[10px] bg-[#EBEDF6]" />
      <div className="flex flex-1 flex-col gap-[7px] pt-[1px]">
        <div className={cn('h-[12px] animate-pulse rounded-[8px] bg-[#EBEDF6]', w1)} />
        <div className={cn('h-[11px] animate-pulse rounded-[8px] bg-[#EBEDF6]', w2)} />
      </div>
    </div>
  )
}

export function NotificationsPopover({
  notifications,
  isLoading = false,
  onMarkAllAsRead,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}: NotificationsPopoverProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const hasUnread = unreadCount > 0
  const hasItems = notifications.length > 0
  const isEmpty = !isLoading && !hasItems
  const unreadLabel = unreadCount > 9 ? '9+' : String(unreadCount)
  const unreadBadge = `${unreadCount} nova${unreadCount > 1 ? 's' : ''}`

  const handleNotifClick = (notif: OrderNotification) => {
    onMarkAsRead?.(notif.id)
    setOpen(false)
    router.push(notif.orderId ? `/vendedor/pedidos?orderId=${notif.orderId}` : '/vendedor/pedidos')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          aria-label="Notificações"
          className={cn(
            'relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[11px] border transition-colors',
            open || hasUnread ? 'border-nxp bg-[#EEF0FB]' : 'border-nxborder bg-white',
          )}
        >
          <Bell size={20} color={open || hasUnread ? '#2A2D7C' : '#4B4E62'} />
          {hasUnread && (
            <span className="absolute -right-[3px] -top-[3px] flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-nxd px-[5px] text-[11px] font-extrabold leading-none text-white">
              {unreadLabel}
            </span>
          )}
        </button>
      </PopoverTrigger>

      {/* ── Popover ── */}
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[calc(100vw-1rem)] overflow-hidden rounded-[16px] border border-nxborder p-0 shadow-[0_24px_48px_-16px_rgba(28,30,43,.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=open]:duration-150 sm:w-[384px]"
      >
        {/* Header */}
        <div className="flex items-center gap-[9px] border-b border-nxborder bg-[#FBFBFD] pb-[13px] pl-[16px] pr-[14px] pt-[14px]">
          <span className="text-[15px] font-extrabold text-nxi1">Notificações</span>
          {hasUnread && (
            <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#EEF0FB] px-[7px] text-[11.5px] font-extrabold whitespace-nowrap text-nxp">
              {unreadBadge}
            </span>
          )}
          <div className="ml-auto flex items-center gap-[4px]">
            {hasUnread && (
              <button
                type="button"
                title="Marcar todas como lidas"
                onClick={onMarkAllAsRead}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] transition-colors hover:bg-[#EEF0FB]"
              >
                <CheckCheck size={17} color="#4B4E62" />
              </button>
            )}
            {hasItems && (
              <button
                type="button"
                title="Limpar todas"
                onClick={onClearAll}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] transition-colors hover:bg-[#EEF0FB]"
              >
                <Trash2 size={16} color="#4B4E62" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div>
            <SkeletonRow w1="w-[62%]" w2="w-[42%]" />
            <SkeletonRow w1="w-[70%]" w2="w-[48%]" />
            <SkeletonRow w1="w-[55%]" w2="w-[38%]" />
          </div>
        ) : isEmpty ? (
          <div className="px-[28px] py-[46px] text-center">
            <div className="mx-auto mb-[15px] flex h-[64px] w-[64px] items-center justify-center rounded-[18px] bg-nxbg">
              <BellOff size={28} color="#8A8CA3" />
            </div>
            <div className="text-[15.5px] font-extrabold text-nxi1">Nenhuma notificação</div>
            <div className="mt-[5px] text-[12.5px] font-semibold leading-[1.5] text-nxi3">
              Novos pedidos aparecerão aqui em tempo real.
            </div>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {notifications.map((notif) => {
              const isUnread = !notif.read
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={cn(
                    'group relative flex cursor-pointer gap-[11px] border-b pb-[13px] pl-[16px] pr-[14px] pt-[13px] transition-colors',
                    isUnread
                      ? 'border-[#EAEBF2] bg-[#EEF0FB] hover:bg-[#E8EAF6]'
                      : 'border-[#F1F2F7] bg-white hover:bg-[#F8F9FC]',
                  )}
                >
                  {/* Ícone */}
                  <span
                    className={cn(
                      'flex h-[36px] w-[36px] flex-none items-center justify-center rounded-[10px]',
                      isUnread ? 'bg-nxp' : 'bg-[#F1F2F7]',
                    )}
                  >
                    <ShoppingBag size={17} color={isUnread ? '#fff' : '#8A8CA3'} />
                  </span>

                  {/* Conteúdo */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-[7px]">
                      {isUnread && (
                        <span className="h-[7px] w-[7px] flex-none rounded-full bg-nxp" />
                      )}
                      <span
                        className={cn(
                          'overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] tracking-[.02em] text-nxi1',
                          isUnread ? 'font-black' : 'font-bold text-nxi2',
                        )}
                      >
                        {notif.orderCode}
                      </span>
                      <span className="ml-auto flex-none whitespace-nowrap text-[11px] font-semibold text-nxi3">
                        {timeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <div className="mt-[3px] flex items-center gap-[6px]">
                      <span
                        className={cn(
                          'overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-nxi2',
                          isUnread ? 'font-bold' : 'font-semibold',
                        )}
                      >
                        {notif.customerName}
                      </span>
                      <span className="flex-none text-[13px] font-extrabold text-nxs">
                        {brl(notif.total)}
                      </span>
                    </div>
                  </div>

                  {/* Chevron (aparece no hover) */}
                  <span className="flex flex-none translate-x-[-4px] items-center opacity-0 transition-all duration-[120ms] group-hover:translate-x-0 group-hover:opacity-100">
                    <ChevronRight size={16} color="#8A8CA3" />
                  </span>

                  {/* Botão dispensar (aparece no hover) */}
                  <button
                    type="button"
                    aria-label="Dispensar"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDismiss?.(notif.id)
                    }}
                    className="absolute right-[8px] top-[8px] flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[#F1F2F7] opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100"
                  >
                    <X size={13} color="#8A8CA3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-nxborder bg-[#FBFBFD] px-[16px] py-[11px]">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.push('/vendedor/pedidos')
            }}
            className="flex items-center gap-[6px] text-[13px] font-extrabold text-nxp"
          >
            Ver todos os pedidos
            <ArrowRight size={15} color="#2A2D7C" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
