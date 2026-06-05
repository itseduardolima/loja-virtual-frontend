'use client'

import { AlertTriangle, AlertCircle, Zap, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useGetPaymentLink } from '@/hooks/useSubscription'
import { Payment } from '@/types/subscription'

interface TopBannerProps {
  status: string
  isCancelScheduled: boolean
  pendingPayment: Payment | null
  onReactivate: () => void
}

export function TopBanner({ status, isCancelScheduled, pendingPayment, onReactivate }: TopBannerProps) {
  const { mutate: getLink, isPending: isFetchingLink } = useGetPaymentLink()

  if (isCancelScheduled) return null

  if (status === 'pending') {
    const amount = pendingPayment
      ? formatPrice(Number(pendingPayment.amount))
      : '—'
    return (
      <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-amber-500">
          <AlertTriangle className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-bold text-amber-900">Pagamento pendente — {amount}</div>
          <div className="text-[12.5px] font-medium text-amber-800/80 leading-snug">
            Sua última cobrança não foi confirmada. Pague para evitar suspensão da loja.
          </div>
        </div>
        {pendingPayment?.payment_id && (
          <button
            onClick={() => getLink(pendingPayment.payment_id!)}
            disabled={isFetchingLink}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2.5 text-[12.5px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-amber-600 disabled:opacity-60"
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            Pagar agora
          </button>
        )}
      </div>
    )
  }

  if (status === 'canceled' || status === 'expired') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-red-500">
          <AlertCircle className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-bold text-red-900">
            {status === 'canceled' ? 'Assinatura cancelada' : 'Assinatura expirada'}
          </div>
          <div className="text-[12.5px] font-medium text-red-800/80 leading-snug">
            Reative agora para não perder cupons, pedidos e configurações.
          </div>
        </div>
        <button
          onClick={onReactivate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2.5 text-[12.5px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
          Reativar assinatura
        </button>
      </div>
    )
  }

  return null
}
