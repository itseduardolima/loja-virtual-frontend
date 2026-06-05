'use client'

import { useState } from 'react'
import { Package, ChevronRight } from 'lucide-react'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { formatPrice, formatDateShort } from '@/lib/utils'
import type { CustomerOrder } from '@/types/customer'
import { Thumb, StatusBadge, SectionSpinner, Empty, getFirstOrderItemImage } from './shared'
import { OrderDetail } from './OrderDetail'

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface SectionPedidosProps {
  onClose: () => void
  onOpenCart?: () => void
}

/* ─── OrderCard (sub-função local) ──────────────────────────────────────── */

function OrderCard({ order, onOpen }: { order: CustomerOrder; onOpen: (id: number) => void }) {
  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const itemNames = order.items.map((i) => i.product.name).join(', ')

  return (
    <button
      onClick={() => onOpen(order.id)}
      className="ac-rise w-full rounded-2xl border border-nxborder bg-white p-3.5 text-left transition-shadow hover:shadow-[0_8px_24px_rgba(3,7,18,0.07)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] font-bold text-nxi1">#{order.order_code}</span>
          <span className="text-[11px] text-nxi3">· {formatDateShort(order.created_at)}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body */}
      <div className="mt-3 flex items-center gap-3">
        {/* Stack de fotos */}
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item) => {
            const imgSrc = getFirstOrderItemImage(item)
            return (
              <div
                key={item.id}
                className="h-11 w-9 overflow-hidden rounded-lg border-2 border-white ring-1 ring-nxborder"
              >
                <Thumb src={imgSrc} alt={item.product.name} sizes="36px" />
              </div>
            )
          })}
        </div>

        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-[12.5px] font-semibold text-nxi1">{itemNames}</p>
          <p className="text-[11px] text-nxi3">
            {totalQty} {totalQty === 1 ? 'item' : 'itens'} · {formatPrice(parseFloat(order.total))}
          </p>
        </div>

        <ChevronRight size={17} className="shrink-0 text-nxi3" />
      </div>
    </button>
  )
}

/* ─── SectionPedidos ─────────────────────────────────────────────────────── */

export function SectionPedidos({ onClose, onOpenCart }: SectionPedidosProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data: ordersData, isLoading } = useCustomerOrders({
    page: 1,
    limit: 20,
    sort: 'DATE_DESC',
  })

  /* Detalhe do pedido */
  if (selectedOrderId !== null) {
    return (
      <OrderDetail
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
        onOpenCart={onOpenCart}
      />
    )
  }

  /* Loading */
  if (isLoading) {
    return <SectionSpinner />
  }

  const orders = ordersData?.data ?? []

  /* Empty state */
  if (orders.length === 0) {
    return (
      <Empty
        icon={Package}
        title="Nenhum pedido ainda"
        desc="Quando você comprar, seus pedidos e o rastreamento aparecem aqui."
        cta="Explorar a loja"
        onCta={onClose}
      />
    )
  }

  /* Lista */
  return (
    <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-5 py-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onOpen={setSelectedOrderId} />
      ))}
      <div className="h-2" />
    </div>
  )
}
