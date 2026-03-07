'use client'

import { useDroppable } from '@dnd-kit/core'
import { type Order } from '@/types/order'
import { OrderKanbanCard } from './OrderKanbanCard'
import { getStatusIcon } from '@/lib/orderPanelUtils'
import { cn } from '@/lib/utils'

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
}

export function KanbanColumn({
  statusKey,
  label,
  orders,
  colors,
  selectedOrderId,
  onSelectOrder,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: getStatusDroppableId(statusKey),
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col w-[280px] shrink-0 rounded-xl border-2 border-dashed transition-colors',
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
          <div className="flex items-center justify-center h-24 text-sm text-gray-400">
            Nenhum pedido
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
    </div>
  )
}
