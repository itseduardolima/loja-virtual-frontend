'use client'

import { useDroppable } from '@dnd-kit/core'
import { type Order } from '@/types/order'
import { STATUS_SEGMENTS } from '@/lib/orderVendorMeta'
import { OrderKanbanCard } from './OrderKanbanCard'
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

/** Meta da coluna (label + dot) a partir dos segmentos de status 1–4. */
function columnMeta(status: number): { label: string; dot: string } {
  const seg = STATUS_SEGMENTS.find((s) => s.key === status)
  return { label: seg?.label ?? 'Pedidos', dot: seg?.dot ?? 'bg-transparent' }
}

interface KanbanColumnProps {
  status: number
  orders: Order[]
  totalCount: number
  selectedId: number | null
  hasMore: boolean
  moreCount: number
  onOpen: (id: number) => void
  onShowMore: () => void
}

export function KanbanColumn({
  status,
  orders,
  totalCount,
  selectedId,
  hasMore,
  moreCount,
  onOpen,
  onShowMore,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: getStatusDroppableId(status),
  })

  const { label, dot } = columnMeta(status)
  const isEmpty = orders.length === 0

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[120px] rounded-[16px] border p-[12px] transition-colors',
        isOver ? 'border-nxp bg-[#EEF0FB]' : 'border-nxborder bg-[#F8F8FB]',
      )}
    >
      <div className="flex items-center gap-[8px] px-[4px] pb-[12px] pt-[2px]">
        <span className={cn('h-[8px] w-[8px] flex-none rounded-full', dot)} />
        <span className="whitespace-nowrap text-[13px] font-extrabold text-nxi1">{label}</span>
        <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#EEF0F4] px-[6px] text-[11px] font-extrabold text-nxi2">
          {totalCount}
        </span>
      </div>

      <div className="flex flex-col gap-[9px]">
        {isOver && (
          <div className="flex h-[74px] items-center justify-center rounded-[12px] border-[1.5px] border-dashed border-[#B7BBE8] text-[12px] font-extrabold text-[#7E82C4]">
            Solte aqui
          </div>
        )}

        {orders.map((order) => (
          <OrderKanbanCard
            key={order.id}
            order={order}
            isSelected={selectedId === order.id}
            onClick={() => onOpen(order.id)}
          />
        ))}

        {isEmpty && !isOver && (
          <div className="rounded-[12px] border-[1.5px] border-dashed border-nxborder p-[20px] text-center text-[12px] font-bold text-nxi3">
            Nenhum pedido
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={onShowMore}
            className="rounded-[10px] border border-dashed border-nxborder bg-white p-[8px] text-[12px] font-extrabold text-nxp"
          >
            Ver mais {moreCount}
          </button>
        )}
      </div>
    </div>
  )
}
