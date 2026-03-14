'use client'

import { useDraggable } from '@dnd-kit/core'
import { type Order } from '@/types/order'
import { formatDate, formatPrice, cn } from '@/lib/utils'

const DRAGGABLE_PREFIX = 'order-'

export function getOrderDraggableId(orderId: number) {
  return `${DRAGGABLE_PREFIX}${orderId}`
}

export function parseOrderIdFromDraggableId(id: string): number | null {
  if (!id.startsWith(DRAGGABLE_PREFIX)) return null
  const num = parseInt(id.slice(DRAGGABLE_PREFIX.length), 10)
  return Number.isNaN(num) ? null : num
}

interface OrderKanbanCardProps {
  order: Order
  isSelected: boolean
  onClick: () => void
  columnColor?: string
}

export function OrderKanbanCard({
  order,
  isSelected,
  onClick,
  columnColor = 'border-gray-200',
}: OrderKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
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
        'rounded-xl border border-gray-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow outline-none focus:outline-none focus-visible:outline-none',
        !isDragging && columnColor,
        isSelected && !isDragging && 'ring-2 ring-gray-900 ring-offset-2',
        isDragging && 'opacity-0 pointer-events-none border-gray-200 ring-0'
      )}
    >
      <p className="font-bold text-sm text-gray-900 truncate">#{order.order_code}</p>
      <p className="text-sm text-gray-600 truncate mt-0.5">{order.customer_name}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(order.created_at)}</span>
        <span className="font-semibold text-gray-900">{formatPrice(parseFloat(order.total))}</span>
      </div>
    </div>
  )
}

/** Versão do card para o DragOverlay (sem ref/listeners, só visual) */
export function OrderKanbanCardPreview({
  order,
  columnColor = 'border-gray-200',
}: {
  order: Order
  columnColor?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-3 shadow-lg cursor-grabbing w-[280px] outline-none ring-0',
        columnColor
      )}
    >
      <p className="font-bold text-sm text-gray-900 truncate">#{order.order_code}</p>
      <p className="text-sm text-gray-600 truncate mt-0.5">{order.customer_name}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(order.created_at)}</span>
        <span className="font-semibold text-gray-900">{formatPrice(parseFloat(order.total))}</span>
      </div>
    </div>
  )
}
