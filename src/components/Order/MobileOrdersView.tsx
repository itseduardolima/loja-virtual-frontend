'use client'

import { useCallback, useEffect, useState } from 'react'
import { List, Download, Search } from 'lucide-react'
import type { Order } from '@/types/order'
import { cn } from '@/lib/utils'
import {
  getStatusMeta,
  STATUS_SEGMENTS,
  itemsCount,
  itemsWord,
  relativeTime,
  formatPrice,
  type OrderKpis,
  type StatusFilter,
} from '@/lib/orderVendorMeta'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { OrderDetailPanel } from './OrderDetailPanel'

interface MobileOrdersViewProps {
  /** Já ordenados; filtramos por statusFilter + busca localmente. */
  orders: Order[]
  kpis: OrderKpis
  selectedId: number | null
  onSelect: (id: number | null) => void
  search: string
  onSearchChange: (v: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (k: StatusFilter) => void
  counts: Record<'all' | 1 | 2 | 3 | 4 | 5, number>
  onExport: () => void
  exporting?: boolean
  exportLocked?: boolean
  // callbacks do detalhe (repassados ao bottom sheet / OrderDetailPanel):
  onEmitNfe: (id: number) => void
  emitting?: boolean
  onAcceptCancelReq: (id: number) => void
  onDenyCancelReq: (id: number) => void
  acceptDenyLoading?: boolean
}

export function MobileOrdersView({
  orders,
  kpis,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  onExport,
  exporting = false,
  exportLocked = false,
  onEmitNfe,
  emitting = false,
  onAcceptCancelReq,
  onDenyCancelReq,
  acceptDenyLoading = false,
}: MobileOrdersViewProps) {
  const q = search.trim().toLowerCase()
  const visibleOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (!q) return true
    return o.order_code.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q)
  })

  return (
    <div className="flex flex-col bg-nxbg">
      {/* ─── Cabeçalho fixo (branco) ─────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-nxborder px-[16px] pt-[16px] pb-[11px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-extrabold tracking-[-.03em] text-nxi1">Pedidos</h1>
          <div className="flex gap-[6px]">
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border border-nxborder bg-white">
              <List className="h-[16px] w-[16px] text-nxp" />
            </span>
            <button
              type="button"
              onClick={onExport}
              disabled={exporting || exportLocked}
              aria-label="Exportar"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border border-nxborder bg-white disabled:opacity-60"
            >
              {exporting ? (
                <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-nxi3 border-t-transparent" />
              ) : (
                <Download className="h-[16px] w-[16px] text-nxi3" />
              )}
            </button>
          </div>
        </div>

        {/* KPIs compactos */}
        <div className="mt-[12px] flex gap-[8px]">
          <div className="flex-1 rounded-[13px] border border-nxborder bg-white px-[10px] py-[9px]">
            <div className="text-[10px] font-bold text-nxi3">Novos</div>
            <div className="text-[18px] font-extrabold text-nxi1">{kpis.novos}</div>
          </div>
          <div className="flex-1 rounded-[13px] border border-nxborder bg-white px-[10px] py-[9px]">
            <div className="text-[10px] font-bold text-nxi3">Receita</div>
            <div className="text-[18px] font-extrabold text-nxi1">{kpis.receitaFmt}</div>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mt-[10px]">
          <span className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2">
            <Search className="h-[15px] w-[15px] text-nxi3" />
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código ou cliente…"
            className="h-[38px] w-full rounded-[11px] border border-nxborder bg-nxbg pl-[34px] pr-[12px] text-[12.5px] font-semibold text-nxi1 placeholder:text-nxi3 outline-none focus:border-nxp"
          />
        </div>

        {/* Segmentos de status (scroll horizontal, sem scrollbar) */}
        <div className="mt-[11px] flex gap-[6px] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_SEGMENTS.map((seg) => {
            const active = statusFilter === seg.key
            const count = counts[seg.key]
            return (
              <button
                key={String(seg.key)}
                type="button"
                onClick={() => onStatusFilterChange(seg.key)}
                className={cn(
                  'flex h-[28px] shrink-0 items-center gap-[5px] rounded-[8px] px-[11px] text-[12px] font-bold',
                  active ? 'bg-nxp text-white' : 'border border-nxborder bg-white text-nxi2',
                )}
              >
                {seg.dot && (
                  <span
                    className={cn('h-[6px] w-[6px] rounded-full', active ? 'bg-white/80' : seg.dot)}
                  />
                )}
                {seg.label}
                {count > 0 && (
                  <span
                    className={cn(
                      'text-[11px] font-bold tabular-nums',
                      active ? 'text-white/80' : 'text-nxi3',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Lista de cards ──────────────────────────────────────────────── */}
      <div className="flex-1 p-[12px]">
        {visibleOrders.length === 0 ? (
          <div className="rounded-[14px] border border-nxborder bg-white px-[20px] py-[48px] text-center">
            <div className="text-[15px] font-extrabold text-nxi1">Nenhum pedido encontrado</div>
            <div className="mt-[5px] text-[12.5px] font-semibold text-nxi3">
              Tente ajustar a busca ou o status.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[9px]">
            {visibleOrders.map((order) => {
              const meta = getStatusMeta(order.status)
              const count = itemsCount(order)
              const unread = order.read === 0
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => onSelect(order.id)}
                  className="w-full rounded-[14px] border border-nxborder bg-white p-[12px] text-left"
                >
                  <div className="flex items-center gap-[7px]">
                    {unread && <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-nxa" />}
                    <span className="text-[12.5px] font-extrabold tabular-nums text-nxi1">
                      {order.order_code}
                    </span>
                    <span className="ml-auto text-[13px] font-extrabold tabular-nums text-nxi1">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'mt-[6px] truncate text-[13.5px] text-nxi1',
                      unread ? 'font-extrabold' : 'font-semibold',
                    )}
                  >
                    {order.customer_name}
                  </div>

                  <div className="mt-[9px] flex items-center justify-between gap-[8px]">
                    <span
                      className={cn(
                        'inline-flex items-center gap-[6px] rounded-[8px] py-[3px] pl-[8px] pr-[9px] text-[11px] font-extrabold',
                        meta.badge,
                      )}
                    >
                      <span className={cn('h-[6px] w-[6px] rounded-full', meta.dot)} />
                      {meta.label}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-nxi3">
                      {count} {itemsWord(count)} · {relativeTime(order.created_at)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── Bottom sheet do detalhe ─────────────────────────────────────── */}
      {selectedId != null && (
        <OrderDetailSheet
          orderId={selectedId}
          onClose={() => onSelect(null)}
          onEmitNfe={() => onEmitNfe(selectedId)}
          emitting={emitting}
          onAcceptCancelReq={() => onAcceptCancelReq(selectedId)}
          onDenyCancelReq={() => onDenyCancelReq(selectedId)}
          acceptDenyLoading={acceptDenyLoading}
        />
      )}
    </div>
  )
}

// ─── Bottom sheet (overlay + folha deslizante) ─────────────────────────────────
interface OrderDetailSheetProps {
  orderId: number
  onClose: () => void
  onEmitNfe: () => void
  emitting: boolean
  onAcceptCancelReq: () => void
  onDenyCancelReq: () => void
  acceptDenyLoading: boolean
}

function OrderDetailSheet({
  orderId,
  onClose,
  onEmitNfe,
  emitting,
  onAcceptCancelReq,
  onDenyCancelReq,
  acceptDenyLoading,
}: OrderDetailSheetProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const [open, setOpen] = useState(false)

  // Entrada: translate-y-full → translate-y-0 no próximo frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Saída: anima de volta e fecha após a transição.
  const handleClose = useCallback(() => {
    setOpen(false)
    const t = setTimeout(onClose, 260)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60]">
      {/* overlay */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={handleClose}
        className={cn(
          'absolute inset-0 bg-[rgba(20,21,34,0.35)] transition-opacity duration-[260ms]',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* folha */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[22px] bg-white transition-transform duration-[260ms] ease-[cubic-bezier(.22,1,.36,1)]',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* grabber */}
        <button
          type="button"
          aria-label="Fechar"
          onClick={handleClose}
          className="flex shrink-0 justify-center px-[16px] pt-[12px] pb-[2px]"
        >
          <span className="h-[4px] w-[40px] rounded-[4px] bg-[#D7D9E3]" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto px-[16px] pt-[12px] pb-[env(safe-area-inset-bottom,16px)]">
          {isLoading || !order ? (
            <div className="flex animate-pulse flex-col gap-[12px]">
              <div className="h-[20px] w-[40%] rounded-[8px] bg-nxbg" />
              <div className="h-[16px] w-[70%] rounded-[8px] bg-nxbg" />
              <div className="h-[120px] w-full rounded-[14px] bg-nxbg" />
              <div className="h-[80px] w-full rounded-[14px] bg-nxbg" />
            </div>
          ) : (
            <OrderDetailPanel
              order={order}
              emitting={emitting}
              onEmitNfe={onEmitNfe}
              cancelReqLoading={acceptDenyLoading}
              onAcceptCancelReq={onAcceptCancelReq}
              onDenyCancelReq={onDenyCancelReq}
            />
          )}
        </div>
      </div>
    </div>
  )
}
