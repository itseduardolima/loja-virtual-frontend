'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, ArrowRight } from 'lucide-react'
import { type Order } from '@/types/order'
import { cn } from '@/lib/utils'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { advanceLabel, canAdvance, canCancel } from '@/lib/orderVendorMeta'
import { OrderDetailPanel } from './OrderDetailPanel'
import { OrderPrintModal } from './OrderPrintModal'

interface OrderDetailDrawerProps {
  orderId: number | null
  onClose: () => void
  onAdvance: (id: number) => void
  /** Abre o modal de motivo (a página trata). */
  onCancel: (id: number) => void
  onAcceptCancelReq: (id: number) => void
  onDenyCancelReq: (id: number) => void
  acceptDenyLoading?: boolean
}

// ─── F1 · Skeleton de carregamento ────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex-1 overflow-hidden p-[18px]">
      <div className="mb-[14px] flex gap-[8px]">
        <div className="h-[24px] w-[88px] animate-pulse rounded-[8px] bg-[#ECEDF2]" />
        <div className="h-[24px] w-[56px] animate-pulse rounded-[8px] bg-[#ECEDF2]" />
      </div>
      <div className="h-[16px] w-2/5 animate-pulse rounded-[8px] bg-[#ECEDF2]" />
      <div className="mt-[10px] h-[22px] w-3/5 animate-pulse rounded-[8px] bg-[#ECEDF2]" />
      <div className="mt-[18px] h-[120px] animate-pulse rounded-[14px] bg-[#ECEDF2]" />
      <div className="mt-[12px] h-[90px] animate-pulse rounded-[14px] bg-[#ECEDF2]" />
    </div>
  )
}

// ─── F2 · Erro ─────────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-[24px] py-[48px] text-center">
      <div className="mb-[14px] flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-[#FBE9EE]">
        <AlertTriangle size={25} className="text-nxd" />
      </div>
      <div className="text-[16px] font-extrabold text-nxi1">Erro ao carregar o pedido</div>
      <div className="mt-[5px] text-[13px] font-semibold text-nxi3">
        Não conseguimos buscar os detalhes deste pedido.
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-[16px] flex h-[38px] items-center gap-[7px] rounded-[11px] bg-nxp px-[16px] text-[13px] font-extrabold text-white transition-colors hover:bg-nxp/90"
      >
        Tentar novamente
      </button>
    </div>
  )
}

// ─── Footer (avançar / cancelar) ───────────────────────────────────────────────
function DrawerFooter({
  order,
  onAdvance,
  onCancel,
}: {
  order: Order
  onAdvance: (id: number) => void
  onCancel: (id: number) => void
}) {
  if (!canAdvance(order.status) && !canCancel(order.status)) return null
  return (
    <div className="flex gap-[9px] border-t border-nxborder bg-white px-[16px] py-[13px]">
      {canAdvance(order.status) && (
        <button
          type="button"
          onClick={() => onAdvance(order.id)}
          className="flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-[11px] bg-nxp text-[13.5px] font-extrabold text-white transition-colors hover:bg-nxp/90"
        >
          <ArrowRight size={16} className="text-white" />
          {advanceLabel(order.status)}
        </button>
      )}
      {canCancel(order.status) && (
        <button
          type="button"
          onClick={() => onCancel(order.id)}
          className="h-[42px] rounded-[11px] border border-[#EBD2CE] bg-white px-[16px] text-[13.5px] font-extrabold text-nxd transition-colors hover:bg-[#FCF2F4]"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

export function OrderDetailDrawer({
  orderId,
  onClose,
  onAdvance,
  onCancel,
  onAcceptCancelReq,
  onDenyCancelReq,
  acceptDenyLoading,
}: OrderDetailDrawerProps) {
  const { data: order, isLoading, error, refetch } = useOrderDetail(orderId ?? 0)
  const [isPrintOpen, setIsPrintOpen] = useState(false)

  // Animação de entrada: monta com translate-x-full, troca p/ 0 no próximo frame.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (orderId == null) {
      setEntered(false)
      return
    }
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [orderId])

  if (orderId == null) return null

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-[rgba(20,21,34,0.34)] transition-opacity duration-[260ms]',
          entered ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Painel deslizante */}
      <aside
        className={cn(
          'fixed bottom-0 right-0 top-0 z-50 flex w-[480px] flex-col bg-white shadow-[-24px_0_60px_-30px_rgba(20,21,34,0.5)]',
          'transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          entered ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {isLoading ? (
          <LoadingState />
        ) : error || !order ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <OrderDetailPanel
              order={order}
              onClose={onClose}
              cancelReqLoading={acceptDenyLoading}
              onAcceptCancelReq={() => onAcceptCancelReq(order.id)}
              onDenyCancelReq={() => onDenyCancelReq(order.id)}
              onPrint={() => setIsPrintOpen(true)}
            />
            <DrawerFooter order={order} onAdvance={onAdvance} onCancel={onCancel} />
            <OrderPrintModal
              order={order}
              isOpen={isPrintOpen}
              onClose={() => setIsPrintOpen(false)}
            />
          </>
        )}
      </aside>
    </>
  )
}
