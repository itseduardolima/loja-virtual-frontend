'use client'

import { Check, XCircle, Clock, CheckCircle, Truck, PackageCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const FLOW = [1, 2, 3, 4] as const
const FLOW_META: Record<number, { label: string; sublabel: string; Icon: React.ElementType }> = {
  1: { label: 'Pendente',   sublabel: 'Pedido recebido',       Icon: Clock },
  2: { label: 'Confirmado', sublabel: 'Confirmado pela loja',  Icon: CheckCircle },
  3: { label: 'Enviado',    sublabel: 'A caminho',             Icon: Truck },
  4: { label: 'Entregue',   sublabel: 'Entregue',              Icon: PackageCheck },
}

export function ProgressStepper({ status }: { status: number }) {
  const cancelled = status === 5
  const curIdx = cancelled ? -1 : FLOW.indexOf(status as typeof FLOW[number])
  const pct = cancelled ? 0 : curIdx <= 0 ? 0 : curIdx / (FLOW.length - 1)

  if (cancelled) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-nxd/25 bg-nxd/[0.05] p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nxd/10 text-nxd">
          <XCircle size={24} />
        </span>
        <div>
          <p className="text-[15px] font-extrabold text-nxd">Pedido cancelado</p>
          <p className="mt-0.5 text-[13px] text-nxi2">Este pedido foi cancelado e não será entregue. Em caso de dúvida, fale com a loja.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* desktop horizontal */}
      <div className="hidden sm:block">
        <div className="relative px-2">
          {/* track */}
          <div className="absolute left-[calc(2rem+8px)] right-[calc(2rem+8px)] top-6 h-[3px] rounded-full bg-nxborder" />
          {/* progress bar */}
          <motion.div
            className="absolute left-[calc(2rem+8px)] top-6 h-[3px] rounded-full bg-nxp"
            style={{ transformOrigin: 'left', width: `calc((100% - 4rem - 16px) * ${pct})` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />
          <div className="relative flex justify-between">
            {FLOW.map((s, i) => {
              const done = i < curIdx
              const active = i === curIdx
              const { label, sublabel, Icon } = FLOW_META[s]
              return (
                <div key={s} className="flex w-16 flex-col items-center text-center">
                  <span
                    className={cn(
                      'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-[3px] bg-white transition-colors',
                      done ? 'border-nxp text-nxp' : active ? 'border-nxp bg-nxp text-white' : 'border-nxborder text-nxi3',
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-nxp/20" />
                    )}
                    {done ? <Check size={20} strokeWidth={3} className="relative" /> : <Icon size={20} className="relative" />}
                  </span>
                  <span className={cn('mt-2.5 text-[11.5px] font-bold leading-tight', active ? 'text-nxp' : done ? 'text-nxi1' : 'text-nxi3')}>
                    {label}
                  </span>
                  <span className="mt-0.5 text-[10px] leading-tight text-nxi3">{sublabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* mobile vertical */}
      <div className="sm:hidden">
        {FLOW.map((s, i) => {
          const done = i < curIdx
          const active = i === curIdx
          const last = i === FLOW.length - 1
          const { label, sublabel, Icon } = FLOW_META[s]
          return (
            <div key={s} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && (
                <span className={cn('absolute left-[19px] top-10 h-[calc(100%-24px)] w-[2px]', done ? 'bg-nxp' : 'bg-nxborder')} />
              )}
              <span
                className={cn(
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] bg-white',
                  done ? 'border-nxp text-nxp' : active ? 'border-nxp bg-nxp text-white' : 'border-nxborder text-nxi3',
                )}
              >
                {done ? <Check size={17} strokeWidth={3} /> : <Icon size={17} />}
              </span>
              <div className="pt-1.5">
                <p className={cn('text-[13.5px] font-bold leading-tight', active ? 'text-nxp' : done ? 'text-nxi1' : 'text-nxi3')}>
                  {label}
                </p>
                <p className="text-[11px] text-nxi3">{sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
