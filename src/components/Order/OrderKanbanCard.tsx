'use client'

import { useDraggable } from '@dnd-kit/core'
import { Package, Clock, FileText, AlertTriangle } from 'lucide-react'
import { type Order } from '@/types/order'
import { itemsCount, itemsWord, relativeTime, formatPrice } from '@/lib/orderVendorMeta'
import { cn } from '@/lib/utils'

const DRAGGABLE_PREFIX = 'order-'

export function getOrderDraggableId(orderId: number) {
  return `${DRAGGABLE_PREFIX}${orderId}`
}

export function parseOrderIdFromDraggableId(id: string): number | null {
  if (!id.startsWith(DRAGGABLE_PREFIX)) return null
  const num = parseInt(id.slice(DRAGGABLE_PREFIX.length), 10)
  return Number.isNaN(num) ? null : num
}

/** Chip de NF-e a partir de order.nfe_status (espelha DCLogic.vmCard). */
function nfeChip(order: Order): { label: string; fg: string; bg: string } | null {
  switch (order.nfe_status) {
    case 'autorizada':
      return { label: 'NF-e ok', fg: 'text-[#2E6B4E]', bg: 'bg-[#E7F2EC]' }
    case 'em_processo':
      return { label: 'NF-e proc.', fg: 'text-[#8A6516]', bg: 'bg-[#FBF3E0]' }
    case 'denegada':
      return { label: 'NF-e neg.', fg: 'text-[#A82F4F]', bg: 'bg-[#FBE9EE]' }
    default:
      return null
  }
}

/** Conteúdo interno do card (compartilhado entre card e preview). */
function OrderKanbanCardBody({ order }: { order: Order }) {
  const isUnread = order.read === 0
  const hasCancelRequest = order.cancellation_requested === 1
  const count = itemsCount(order)
  const chip = nfeChip(order)
  const hasBadgeRow = hasCancelRequest || !!chip

  return (
    <>
      <div className="flex items-center gap-[7px]">
        {isUnread && (
          <span className="h-[7px] w-[7px] flex-none rounded-full bg-nxa" />
        )}
        <span className="min-w-0 flex-1 truncate font-extrabold text-[12.5px] text-nxi1 tracking-[.02em] tabular-nums">
          {order.order_code}
        </span>
        <span className="flex-none pl-[6px] font-extrabold text-[13px] text-nxi1 tabular-nums">
          {formatPrice(parseFloat(order.total))}
        </span>
      </div>

      <div
        className={cn(
          'mt-[6px] truncate text-[13px] text-nxi1',
          isUnread ? 'font-extrabold' : 'font-semibold',
        )}
      >
        {order.customer_name}
      </div>

      <div className="mt-[8px] flex items-center gap-[8px] text-[11.5px] font-bold text-nxi3">
        <span className="flex items-center gap-[4px]">
          <Package className="h-[13px] w-[13px]" />
          {count} {itemsWord(count)}
        </span>
        <span className="flex items-center gap-[4px]">
          <Clock className="h-[13px] w-[13px]" />
          {relativeTime(order.created_at)}
        </span>
      </div>

      {hasBadgeRow && (
        <div className="mt-[9px] flex flex-wrap gap-[5px]">
          {hasCancelRequest && (
            <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-[#FBEEE6] px-[7px] py-[2px] text-[10.5px] font-extrabold text-[#B5491D]">
              <AlertTriangle className="h-[11px] w-[11px]" />
              Cancelamento
            </span>
          )}
          {chip && (
            <span
              className={cn(
                'inline-flex items-center gap-[4px] rounded-[6px] px-[7px] py-[2px] text-[10.5px] font-extrabold',
                chip.fg,
                chip.bg,
              )}
            >
              <FileText className="h-[11px] w-[11px]" />
              {chip.label}
            </span>
          )}
        </div>
      )}
    </>
  )
}

interface OrderKanbanCardProps {
  order: Order
  isSelected: boolean
  onClick: () => void
}

export function OrderKanbanCard({ order, isSelected, onClick }: OrderKanbanCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: getOrderDraggableId(order.id),
    data: { order },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'rounded-[14px] border bg-white p-[11px_12px] cursor-grab transition-shadow outline-none focus:outline-none focus-visible:outline-none active:cursor-grabbing',
        isSelected
          ? 'border-nxp shadow-[0_0_0_3px_rgba(42,45,124,0.12)]'
          : 'border-nxborder shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        isDragging && 'opacity-[0.45]',
      )}
    >
      <OrderKanbanCardBody order={order} />
    </div>
  )
}

/** Versão do card para o DragOverlay (sem ref/listeners, só visual). */
export function OrderKanbanCardPreview({ order }: { order: Order }) {
  return (
    <div className="w-[268px] rounded-[14px] border border-nxp bg-white p-[11px_12px] shadow-[0_18px_36px_-12px_rgba(28,30,43,0.4)]">
      <OrderKanbanCardBody order={order} />
    </div>
  )
}
