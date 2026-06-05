'use client'

import { useDroppable } from '@dnd-kit/core'
import { type Order } from '@/types/order'
import { OrderKanbanCard } from './OrderKanbanCard'
import { getStatusIcon } from './OrderStatusIcon'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const DROPPABLE_PREFIX = 'status-'

export function getStatusDroppableId(status: number) {
  return `${DROPPABLE_PREFIX}${status}`
}

export function parseStatusFromDroppableId(id: string): number | null {
  if (!id.startsWith(DROPPABLE_PREFIX)) return null
  const num = parseInt(id.slice(DROPPABLE_PREFIX.length), 10)
  return Number.isNaN(num) ? null : num
}

interface KanbanColumnProps {
  statusKey: number
  label: string
  orders: Order[]
  colors: { bg: string; badge: string; icon: string; selectedRow: string }
  selectedOrderId: number | null
  onSelectOrder: (orderId: number) => void
  hasMore?: boolean
  onShowMore?: () => void
  hasDateFilter?: boolean
}

export function KanbanColumn({
  statusKey,
  label,
  orders,
  colors,
  selectedOrderId,
  onSelectOrder,
  hasMore,
  onShowMore,
  hasDateFilter,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: getStatusDroppableId(statusKey),
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-[220px] rounded-xl border-2 border-dashed transition-colors',
        isOver ? 'border-gray-400 bg-gray-50/80' : 'border-gray-200 bg-gray-50/30'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-t-xl border-b',
          colors.bg,
          isOver && 'ring-2 ring-gray-300 ring-inset'
        )}
      >
        <span className={cn('shrink-0', colors.icon)}>{getStatusIcon(statusKey)}</span>
        <span className={cn('font-bold text-sm flex-1', colors.icon)}>{label}</span>
      </div>
      <div className="flex-1 min-h-[120px] p-3 space-y-2">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-sm text-gray-400 text-center px-2">
            {hasDateFilter ? 'Nenhum pedido no período' : 'Nenhum pedido'}
          </div>
        ) : (
          orders.map((order) => (
            <OrderKanbanCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              onClick={() => onSelectOrder(order.id)}
              columnColor={colors.selectedRow ? 'border-gray-200' : 'border-gray-200'}
            />
          ))
        )}
      </div>
      {hasMore && onShowMore && (
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={onShowMore}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Ver mais pedidos
          </button>
        </div>
      )}
    </div>
  )
}
