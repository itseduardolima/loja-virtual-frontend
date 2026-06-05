'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRefundSubscription } from '@/hooks/useSubscription'
import { formatPrice } from '@/lib/utils'

interface RefundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planPrice: number
  daysRemaining: number
}

export function RefundModal({ open, onOpenChange, planPrice, daysRemaining }: RefundModalProps) {
  const { mutate: requestRefund, isPending } = useRefundSubscription()

  const handleConfirm = () => {
    requestRefund(undefined, {
      onSuccess: () => onOpenChange(false),
      onError: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">

        {/* Header */}
        <div className="px-6 pb-5 pt-6">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-nxi3">Reembolso</p>
          <h2 className="text-[18px] font-extrabold leading-snug tracking-tight text-nxi1">
            Solicitar reembolso
          </h2>
        </div>

        <div className="border-t border-nxborder" />

        {/* Body */}
        <div className="space-y-4 px-6 py-5">

          {/* Valor em destaque */}
          <div className="flex items-center justify-between rounded-xl border border-nxborder bg-nxbg px-4 py-3.5">
            <div>
              <p className="text-[11.5px] font-semibold text-nxi3">Valor a ser reembolsado</p>
              <p className="mt-0.5 text-[22px] font-extrabold tracking-tight text-nxi1">
                {formatPrice(planPrice)}
              </p>
            </div>
            <div className="rounded-full bg-green-50 px-3 py-1.5 text-[11.5px] font-bold text-green-700">
              {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''} restantes
            </div>
          </div>

          {/* O que acontece */}
          <div className="space-y-2.5 rounded-xl border border-nxborder px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-nxi3">O que acontece</p>
            <div className="space-y-2">
              {[
                'Sua solicitação entra em análise pelo administrador.',
                'Após aprovação, a assinatura é cancelada e o valor estornado.',
                'O estorno pode levar até 7 dias úteis dependendo do método de pagamento.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-nxi3" />
                  <p className="text-[12.5px] leading-relaxed text-nxi2">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-nxborder bg-nxbg px-6 py-4">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-xl border border-nxborder bg-white px-5 py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-xl bg-nxp px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90 disabled:opacity-60"
          >
            {isPending ? 'Enviando…' : 'Confirmar solicitação'}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
