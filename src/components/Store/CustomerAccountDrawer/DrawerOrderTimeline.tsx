'use client'

import { Check, Package, Truck, Home, XCircle } from 'lucide-react'
import { useOrderStatusHistory } from '@/hooks/useOrderStatusHistory'
import { cn, formatDateShort } from '@/lib/utils'

/* ─── Passos fixos da timeline ─────────────────────────────────────────── */

const TRACK_STEPS = [
  { k: 1, label: 'Pedido recebido', icon: Check },
  { k: 2, label: 'Pagamento confirmado', icon: Package },
  { k: 3, label: 'Enviado', icon: Truck },
  { k: 4, label: 'Entregue', icon: Home },
] as const

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface DrawerOrderTimelineProps {
  status: number
  orderId: number
  updatedAt?: string
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

export function DrawerOrderTimeline({ status, orderId, updatedAt }: DrawerOrderTimelineProps) {
  const { data: historyData } = useOrderStatusHistory(orderId, false)

  /* Mapeia status → data do histórico */
  const dateByStatus = (historyData?.data ?? []).reduce<Record<number, string>>((acc, entry) => {
    if (!acc[entry.status]) acc[entry.status] = entry.created_at
    return acc
  }, {})

  /* ── Cancelado: banner no lugar da timeline ── */
  if (status === 5) {
    const cancelledAt = dateByStatus[5] ?? updatedAt
    return (
      <div className="flex items-center gap-3 rounded-xl bg-nxd/[0.06] px-4 py-3">
        <XCircle size={18} className="shrink-0 text-nxd" />
        <div>
          <p className="text-[12.5px] font-bold text-nxd">Pedido cancelado</p>
          <p className="text-[11px] text-nxi3">
            {cancelledAt
              ? `Este pedido foi cancelado em ${formatDateShort(cancelledAt)}.`
              : 'Este pedido foi cancelado.'}
          </p>
        </div>
      </div>
    )
  }

  const currentIdx = TRACK_STEPS.findIndex((s) => s.k === status)

  return (
    <div className="relative pl-1">
      {TRACK_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const last = i === TRACK_STEPS.length - 1
        const StepIcon = done ? Check : step.icon
        const historyDate = dateByStatus[step.k]

        return (
          <div key={step.k} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Conector vertical */}
            {!last && (
              <span
                className={cn(
                  'absolute left-[13px] top-7 h-[calc(100%-12px)] w-[2px]',
                  done ? 'bg-nxs' : 'bg-nxborder',
                )}
              />
            )}

            {/* Círculo */}
            <span
              className={cn(
                'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                done
                  ? 'bg-nxs text-white'
                  : active
                    ? 'bg-store text-white ring-4 ring-store/15'
                    : 'bg-nxbg text-nxi3',
              )}
            >
              <StepIcon size={14} strokeWidth={2.5} />
            </span>

            {/* Label + estado */}
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-[13px] font-bold',
                  active ? 'text-store' : done ? 'text-nxi1' : 'text-nxi3',
                )}
              >
                {step.label}
              </p>
              {active && <p className="text-[11px] font-semibold text-store">Em andamento</p>}
              {done && historyDate && (
                <p className="text-[11px] text-nxi3">{formatDateShort(historyDate)}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
