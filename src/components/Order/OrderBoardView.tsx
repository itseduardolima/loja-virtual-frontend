'use client'

import { XCircle } from 'lucide-react'
import { type Order } from '@/types/order'
import { BOARD_STATUSES } from '@/lib/orderVendorMeta'
import { KanbanColumn } from './KanbanColumn'

const COLUMN_PAGE_SIZE = 99

interface OrderBoardViewProps {
  orders: Order[]
  selectedId: number | null
  columnLimits: Record<number, number>
  cancelCount: number
  onOpen: (id: number) => void
  onShowMore: (status: number) => void
  onViewCancelled: () => void
}

export function OrderBoardView({
  orders,
  selectedId,
  columnLimits,
  cancelCount,
  onOpen,
  onShowMore,
  onViewCancelled,
}: OrderBoardViewProps) {
  return (
    <div>
      <div className="grid grid-cols-4 items-start gap-[13px]">
        {BOARD_STATUSES.map((status) => {
          const list = orders.filter((o) => o.status === status)
          const limit = columnLimits[status] ?? COLUMN_PAGE_SIZE
          const shown = list.slice(0, limit)
          const hasMore = list.length > limit

          return (
            <KanbanColumn
              key={status}
              status={status}
              orders={shown}
              totalCount={list.length}
              selectedId={selectedId}
              hasMore={hasMore}
              moreCount={list.length - limit}
              onOpen={onOpen}
              onShowMore={() => onShowMore(status)}
            />
          )
        })}
      </div>

      <div className="mt-[14px] flex items-center gap-[10px] rounded-[13px] border border-dashed border-nxborder bg-white px-[14px] py-[11px]">
        <XCircle className="h-[15px] w-[15px] flex-none text-[#A82F4F]" />
        <span className="text-[12.5px] font-bold text-nxi2">Cancelados ficam fora do fluxo</span>
        <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#FBE9EE] px-[6px] text-[11px] font-extrabold text-[#A82F4F]">
          {cancelCount}
        </span>
        <button
          type="button"
          onClick={onViewCancelled}
          className="ml-auto h-[30px] rounded-[9px] border border-nxborder bg-white px-[12px] text-[12px] font-extrabold text-nxp"
        >
          Ver cancelados
        </button>
      </div>
    </div>
  )
}
