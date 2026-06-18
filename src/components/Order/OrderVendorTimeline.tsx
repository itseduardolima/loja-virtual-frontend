'use client'

import { Check } from 'lucide-react'
import { type Order } from '@/types/order'
import { cn } from '@/lib/utils'
import { dateShort } from '@/lib/orderVendorMeta'

interface OrderVendorTimelineProps {
  order: Order
}

interface TimelineNode {
  label: string
  time: string
  done: boolean
  cancel?: boolean
  /** É o passo atual (current) — só no fluxo não-cancelado. */
  current?: boolean
  /** Renderiza a linha conectora abaixo do dot. */
  hasLine: boolean
  /** Cor da linha conectora. */
  lineDone: boolean
  /** Linha de cancelamento (rosa). */
  lineCancel?: boolean
}

const STEPS: { n: number; label: string }[] = [
  { n: 1, label: 'Pedido recebido' },
  { n: 2, label: 'Em preparação' },
  { n: 3, label: 'Enviado' },
  { n: 4, label: 'Entregue' },
]

function buildNodes(order: Order): TimelineNode[] {
  // Cancelado (status 5): "Pedido recebido" (verde) → "Cancelado" (rosa).
  if (order.status === 5) {
    return [
      {
        label: 'Pedido recebido',
        time: dateShort(order.created_at),
        done: true,
        hasLine: true,
        lineDone: true,
        lineCancel: true,
      },
      {
        label: 'Cancelado',
        time: dateShort(order.created_at),
        done: true,
        cancel: true,
        hasLine: false,
        lineDone: false,
      },
    ]
  }

  return STEPS.map((s, i, arr) => {
    const done = order.status >= s.n
    const current = order.status === s.n
    return {
      label: s.label,
      time: done ? (s.n === 1 ? dateShort(order.created_at) : 'concluído') : 'pendente',
      done,
      current,
      hasLine: i < arr.length - 1,
      lineDone: order.status > s.n,
    }
  })
}

/** Linha do tempo do pedido (versão vendedor). Espelha `DCLogic.timeline`. */
export function OrderVendorTimeline({ order }: OrderVendorTimelineProps) {
  const nodes = buildNodes(order)

  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => (
        <div key={i} className="flex gap-[13px]">
          {/* Dot + linha conectora */}
          <div className="flex flex-none flex-col items-center">
            <span
              className={cn(
                'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2',
                node.cancel
                  ? 'border-[#D6456A] bg-[#D6456A]'
                  : node.current
                    ? 'border-nxp bg-nxp'
                    : node.done
                      ? 'border-nxs bg-nxs'
                      : 'border-[#D7D9E3] bg-white',
              )}
            >
              {node.done && !node.cancel && !node.current && (
                <Check size={11} className="text-white" />
              )}
            </span>
            {node.hasLine && (
              <span
                className={cn(
                  'w-[2px] flex-1 min-h-[14px]',
                  node.lineCancel ? 'bg-[#D6456A]' : node.lineDone ? 'bg-nxs' : 'bg-nxborder',
                )}
              />
            )}
          </div>

          {/* Label + tempo */}
          <div className="pb-[18px]">
            <div
              className={cn(
                'text-[13px] font-extrabold',
                node.cancel
                  ? 'text-[#A82F4F]'
                  : node.current
                    ? 'text-nxp'
                    : node.done
                      ? 'text-nxi1'
                      : 'text-nxi3',
              )}
            >
              {node.label}
            </div>
            <div className="mt-[2px] text-[11.5px] font-semibold text-nxi3">{node.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
