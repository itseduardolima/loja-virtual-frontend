'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { type Order } from '@/types/order'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/orderVendorMeta'

interface CancellationRequestModalProps {
  open: boolean
  order: Order | null
  onClose: () => void
  onAccept: () => void
  onDeny: () => void
  loading?: boolean
}

/**
 * I1 / I1b · Solicitação de cancelamento do cliente — o lojista aceita ou recusa.
 * Mostra o motivo informado (ou "Nenhum motivo informado." em itálico se vazio).
 */
export function CancellationRequestModal({
  open,
  order,
  onClose,
  onAccept,
  onDeny,
  loading = false,
}: CancellationRequestModalProps) {
  // Esc fecha.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !order) return null

  const reason = order.cancellation_request_reason?.trim()

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(20,21,34,0.42)] p-[24px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[404px] rounded-[18px] bg-white p-[22px] shadow-[0_30px_70px_-28px_rgba(20,21,34,0.6)]"
      >
        {/* Cliente */}
        <div className="flex items-center gap-[11px]">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#DADCEC] text-[15px] font-extrabold text-nxp">
            {getInitials(order.customer_name)}
          </span>
          <div>
            <div className="text-[15px] font-extrabold text-nxi1">{order.customer_name}</div>
            <div className="text-[12px] font-semibold text-nxi3">Pedido #{order.order_code}</div>
          </div>
        </div>

        {/* Motivo */}
        <div
          className={cn(
            'mt-[14px] rounded-[12px] bg-nxbg p-[12px_13px] text-[12.5px] font-semibold leading-[1.45]',
            reason ? 'text-nxi2' : 'italic text-nxi3',
          )}
        >
          {reason ? `“${reason}”` : 'Nenhum motivo informado.'}
        </div>

        {/* Ações */}
        <div className="mt-[16px] flex gap-[9px]">
          <button
            type="button"
            onClick={onDeny}
            disabled={loading}
            className="h-[42px] flex-1 rounded-[11px] border border-nxborder bg-white text-[13.5px] font-extrabold text-nxi2"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className={cn(
              'flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-[11px] text-[13.5px] font-extrabold text-white',
              loading ? 'bg-[#D88A82]' : 'bg-nxd',
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin text-white" />}
            {loading ? 'Cancelando…' : 'Aceitar e cancelar'}
          </button>
        </div>
      </div>
    </div>
  )
}
