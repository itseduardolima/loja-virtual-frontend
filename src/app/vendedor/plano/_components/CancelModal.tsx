'use client'

import { X } from 'lucide-react'
import { cn, formatDateShort } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { derivePlanFeaturesComparison } from '@/lib/planUtils'
import { SubscriptionPlan } from '@/types/subscription'

const CANCEL_REASONS = [
  'Muito caro',
  'Pouco uso',
  'Mudei pra concorrente',
  'Loja fechou',
  'Outro motivo',
]

interface CancelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: SubscriptionPlan | null
  periodEnd: string | undefined
  reason: string | null
  isCanceling: boolean
  onReasonChange: (reason: string | null) => void
  onConfirm: () => void
}

export function CancelModal({
  open,
  onOpenChange,
  plan,
  periodEnd,
  reason,
  isCanceling,
  onReasonChange,
  onConfirm,
}: CancelModalProps) {
  const lostFeatures = plan
    ? derivePlanFeaturesComparison(plan).filter(f => f.included).slice(1)
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">

        {/* Header */}
        <div className="px-6 pb-5 pt-6">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-red-500">Cancelamento de assinatura</p>
          <h2 className="text-[18px] font-extrabold leading-snug tracking-tight text-nxi1">
            Tem certeza que quer cancelar?
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-nxi2">
            Você pode reativar a qualquer momento e seus dados ficam guardados por 60 dias.
          </p>
        </div>

        <div className="border-t border-nxborder" />

        {/* Body */}
        <div className="space-y-5 px-6 py-5">

          {/* O que você perde */}
          {lostFeatures.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-red-100 bg-red-50/50">
              <div className="border-b border-red-100 px-4 py-2.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
                  Você vai perder
                </span>
              </div>
              <ul className="grid grid-cols-2 divide-x divide-red-100/70">
                {lostFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                      <X className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-[12.5px] font-medium text-nxi1">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Acesso até */}
          {periodEnd && (
            <div className="flex items-baseline gap-3 rounded-xl bg-nxbg px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-nxi3">Você ainda tem acesso até</p>
                <p className="mt-0.5 text-[15px] font-bold text-nxi1">{formatDateShort(periodEnd, { utc: true })}</p>
              </div>
              <div className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                após essa data, loja desativada
              </div>
            </div>
          )}

          {/* Motivo */}
          <div>
            <p className="mb-2.5 text-[12px] font-semibold text-nxi3">Motivo do cancelamento (opcional)</p>
            <div className="flex flex-wrap gap-1.5">
              {CANCEL_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => onReasonChange(reason === r ? null : r)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all',
                    reason === r
                      ? 'border-nxi1 bg-nxi1 text-white'
                      : 'border-nxborder bg-white text-nxi2 hover:border-nxi3 hover:text-nxi1',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-nxborder bg-nxbg px-6 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-nxborder bg-white px-5 py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isCanceling}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isCanceling ? 'Cancelando…' : 'Cancelar assinatura'}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
