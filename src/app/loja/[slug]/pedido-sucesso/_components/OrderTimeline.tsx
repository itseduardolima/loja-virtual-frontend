'use client'

import { Check, MessageCircle, Wallet, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    title: 'Pedido recebido',
    description: 'Registramos seu pedido',
    Icon: Check,
    state: 'done' as const,
  },
  {
    title: 'Combinar no WhatsApp',
    description: 'Pagamento e entrega com a loja',
    Icon: MessageCircle,
    state: 'active' as const,
  },
  {
    title: 'Pagamento',
    description: 'Da forma combinada',
    Icon: Wallet,
    state: 'todo' as const,
  },
  {
    title: 'Envio',
    description: 'A caminho de você',
    Icon: Truck,
    state: 'todo' as const,
  },
]

export function OrderTimeline() {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">
        Próximos passos
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className={cn(
              'relative rounded-2xl border p-4',
              step.state === 'active' ? 'border-nxp bg-nxp/[0.04]' : 'border-nxborder bg-white',
            )}
          >
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full',
                step.state === 'done'
                  ? 'bg-nxs text-white'
                  : step.state === 'active'
                    ? 'bg-nxp text-white'
                    : 'bg-nxbg text-nxi3',
              )}
            >
              <step.Icon size={16} strokeWidth={2.5} />
            </div>
            <p className="mt-2.5 text-[12.5px] font-bold text-nxi1">{step.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-nxi3">{step.description}</p>
            {step.state === 'active' && (
              <span className="absolute right-3 top-3 text-[9px] font-bold uppercase tracking-wide text-nxp">
                agora
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
