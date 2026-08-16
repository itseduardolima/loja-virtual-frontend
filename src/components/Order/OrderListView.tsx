'use client'

import {
  ArrowUpDown,
  ArrowDown,
  ArrowRight,
  AlertTriangle,
  Ticket,
} from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { type Order } from '@/types/order'
import { cn } from '@/lib/utils'
import {
  getStatusMeta,
  canAdvance,
  itemsCount,
  dateShort,
  relativeTime,
  formatPrice,
  type OrderSortKey,
} from '@/lib/orderVendorMeta'

interface OrderListViewProps {
  orders: Order[]
  selectedId: number | null
  sortKey: OrderSortKey
  onOpen: (id: number) => void
  onSortBy: (key: OrderSortKey) => void
  onAdvance: (id: number) => void
  onWhatsApp: (order: Order) => void
}

// Cliente com fr moderado: com valor alto (ex-2.2fr) ele engolia toda a sobra
// em telas largas e "Itens" parecia uma coluna gigante
const GRID =
  'grid grid-cols-[minmax(160px,1.1fr)_minmax(220px,1.3fr)_48px_minmax(140px,1.1fr)_minmax(170px,1.2fr)_minmax(140px,1fr)_104px] items-center gap-[10px] px-[18px] py-[11px]'
const HEAD_LABEL = 'text-[11px] font-extrabold uppercase tracking-[0.06em] text-nxi3'
const HEAD_BTN = 'flex items-center gap-[5px] border-none bg-transparent p-0 cursor-pointer'

export function OrderListView({
  orders,
  selectedId,
  sortKey,
  onOpen,
  onSortBy,
  onAdvance,
  onWhatsApp,
}: OrderListViewProps) {
  return (
    <div className="rounded-[16px] border border-nxborder bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* head */}
      <div className={cn(GRID, 'border-b border-nxborder bg-[#FBFBFD]')}>
        <div className={HEAD_LABEL}>Código</div>
        <button
          type="button"
          onClick={() => onSortBy(sortKey === 'az' ? 'za' : 'az')}
          className={cn(HEAD_BTN, HEAD_LABEL)}
        >
          Cliente
        </button>
        <div className={cn(HEAD_LABEL, 'text-center')}>Itens</div>
        <button
          type="button"
          onClick={() => onSortBy(sortKey === 'high' ? 'low' : 'high')}
          className={cn(HEAD_BTN, HEAD_LABEL, 'justify-end pr-[28px]')}
        >
          Total
          <ArrowUpDown size={12} className="text-[#B7B9C6]" />
        </button>
        <button
          type="button"
          onClick={() => onSortBy(sortKey === 'recent' ? 'old' : 'recent')}
          className={cn(HEAD_BTN, HEAD_LABEL)}
        >
          Data
          <ArrowDown size={12} className="text-[#B7B9C6]" />
        </button>
        <div className={HEAD_LABEL}>Status</div>
        <div className={cn(HEAD_LABEL, 'text-center')}>Ações</div>
      </div>

      {/* rows */}
      {orders.map((order) => {
        const isSelected = selectedId === order.id
        const isUnread = order.read === 0
        const hasCancelReq = order.cancellation_requested === 1
        const hasCoupon = !!order.coupon_code
        const statusMeta = getStatusMeta(order.status)
        const advanceable = canAdvance(order.status)

        return (
          <div
            key={order.id}
            onClick={() => onOpen(order.id)}
            className={cn(
              GRID,
              'relative cursor-pointer border-b border-[#F0F1F5] hover:bg-[#F8F9FC]',
              isSelected ? 'bg-[#EEF0FB]' : isUnread ? 'bg-[#FFFDF9]' : 'bg-white',
            )}
          >
            {/* accent bar */}
            <div
              className={cn(
                'absolute left-0 top-0 bottom-0 w-[3px]',
                isSelected ? 'bg-nxp' : isUnread ? 'bg-nxa' : 'bg-transparent',
              )}
            />

            {/* Código */}
            <div className="flex min-w-0 items-center gap-[7px] font-extrabold text-[13px] tabular-nums tracking-[0.02em] text-nxi1">
              <span
                className={cn(
                  'h-[7px] w-[7px] flex-none rounded-full',
                  isUnread ? 'bg-nxa' : 'bg-transparent',
                )}
              />
              <span className="truncate">{order.order_code}</span>
            </div>

            {/* Cliente */}
            <div className="min-w-0">
              <div
                className={cn(
                  'truncate text-[13.5px] text-nxi1',
                  isUnread ? 'font-extrabold' : 'font-semibold',
                )}
              >
                {order.customer_name}
              </div>
              {hasCancelReq && (
                <span className="mt-[3px] inline-flex items-center gap-[4px] rounded-[6px] bg-[#FBEEE6] px-[7px] py-[1px] text-[10.5px] font-extrabold text-[#B5491D]">
                  <AlertTriangle size={11} className="text-[#B5491D]" />
                  Cancelamento
                </span>
              )}
              {hasCoupon && (
                <span className="mt-[3px] ml-[4px] inline-flex items-center gap-[4px] rounded-[6px] bg-[#EAF2EC] px-[7px] py-[1px] text-[10.5px] font-extrabold text-[#2E6B4E]">
                  <Ticket size={11} className="text-[#2E6B4E]" />
                  {order.coupon_code}
                </span>
              )}
            </div>

            {/* Itens */}
            <div className="text-center text-[13px] font-bold tabular-nums text-nxi2">
              {itemsCount(order)}
            </div>

            {/* Total */}
            <div className="pr-[28px] text-right text-[13.5px] font-extrabold tabular-nums text-nxi1">
              {formatPrice(parseFloat(order.total))}
            </div>

            {/* Data */}
            <div className="leading-[1.25]">
              <div className="text-[12.5px] font-bold tabular-nums text-nxi2">
                {dateShort(order.created_at)}
              </div>
              <div className="text-[11px] font-semibold text-nxi3">
                {relativeTime(order.created_at)}
              </div>
            </div>

            {/* Status */}
            <div>
              <span
                className={cn(
                  'inline-flex items-center gap-[6px] rounded-[8px] pl-[8px] pr-[9px] py-[3px] text-[11.5px] font-extrabold whitespace-nowrap',
                  statusMeta.badge,
                )}
              >
                <span className={cn('h-[6px] w-[6px] rounded-full', statusMeta.dot)} />
                {statusMeta.label}
              </span>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-center gap-[5px]">
              {advanceable ? (
                <button
                  type="button"
                  title="Avançar status"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdvance(order.id)
                  }}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-nxborder bg-white cursor-pointer"
                >
                  <ArrowRight size={15} className="text-nxp" />
                </button>
              ) : (
                <span className="h-[30px] w-[30px] flex-none" aria-hidden />
              )}
              <button
                type="button"
                title="WhatsApp"
                onClick={(e) => {
                  e.stopPropagation()
                  onWhatsApp(order)
                }}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-nxborder bg-white cursor-pointer"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                  <WhatsappIcon />
                </span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
