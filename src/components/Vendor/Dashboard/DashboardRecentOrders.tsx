'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { RecentOrder } from '@/hooks/useDashboard'
import { cn } from '@/lib/utils'
import {
  avatarHueFor,
  formatBRL,
  getInitials,
  getStatusTone,
  timeAgo,
  type StatusTone,
} from '@/lib/vendor'

interface DashboardRecentOrdersProps {
  orders: RecentOrder[]
  isLoading: boolean
}

const MAX_ITEMS = 6

const BADGE_TONE: Record<StatusTone, string> = {
  primary: 'bg-nxp/10 text-nxp',
  success: 'bg-nxs/10 text-nxs',
  warning: 'bg-nxw/[0.12] text-[#94640A]',
  danger: 'bg-nxd/10 text-nxd',
  neutral: 'border border-nxborder bg-nxbg text-nxi2',
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      {children}
    </div>
  )
}

function CardHeader() {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
      <div>
        <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-nxi1">
          Pedidos recentes
        </h3>
        <div className="mt-0.5 text-[12.5px] text-nxi2">Últimas atividades</div>
      </div>
      <Link
        href="/vendedor/pedidos"
        className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-nxp hover:underline"
      >
        Ver pedidos <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function OrderRowSkeleton() {
  return (
    <div className="grid grid-cols-[36px_1fr_auto] items-center gap-3 px-3 py-2.5">
      <div className="h-9 w-9 animate-pulse rounded-full bg-nxbg" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-24 animate-pulse rounded bg-nxbg" />
        <div className="h-3 w-32 animate-pulse rounded bg-nxbg" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="h-3 w-16 animate-pulse rounded bg-nxbg" />
        <div className="h-2.5 w-12 animate-pulse rounded bg-nxbg" />
      </div>
    </div>
  )
}

export function DashboardRecentOrders({ orders, isLoading }: DashboardRecentOrdersProps) {
  if (isLoading) {
    return (
      <CardShell>
        <CardHeader />
        <div className="px-2 pt-1 pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      </CardShell>
    )
  }

  const items = orders.slice(0, MAX_ITEMS)

  if (items.length === 0) {
    return (
      <CardShell>
        <CardHeader />
        <div className="px-4 py-8 text-center text-[12.5px] text-nxi3">
          Nenhum pedido recente neste período
        </div>
      </CardShell>
    )
  }

  return (
    <CardShell>
      <CardHeader />
      <div className="px-2 pt-1 pb-3">
        {items.map((order) => {
          const tone = getStatusTone(order.status)
          const customerName = order.customer_name || 'Cliente'
          const initials = getInitials(customerName)

          return (
            <Link
              key={order.id}
              href={`/vendedor/pedidos?orderId=${order.id}`}
              className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-nxbg"
            >
              <div
                aria-label={customerName}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold tracking-[-0.01em] text-white"
                style={{ background: avatarHueFor(customerName) }}
              >
                {initials}
              </div>

              <div className="min-w-0">
                <div className="truncate font-mono text-[10.5px] tracking-[-0.02em] text-nxi3">
                  #{order.order_code || order.order_number}
                </div>
                <div className="mt-0.5 truncate text-[13px] font-medium text-nxi1">
                  {customerName}
                </div>
              </div>

              <div className="text-right">
                <div className="whitespace-nowrap text-[13px] font-bold tracking-[-0.015em] tabular-nums text-nxi1">
                  {formatBRL(order.total)}
                </div>
                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold',
                      BADGE_TONE[tone],
                    )}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    {order.status_text}
                  </span>
                  <span className="text-[11px] tabular-nums text-nxi3">
                    {timeAgo(new Date(order.created_at))}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </CardShell>
  )
}
