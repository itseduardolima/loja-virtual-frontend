'use client'

import { Check, MessageCircle, Package, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { title: 'Pedido recebido', Icon: Check, state: 'done' as const },
  { title: 'Combinar no WhatsApp', Icon: MessageCircle, state: 'active' as const },
  { title: 'Preparando', Icon: Package, state: 'todo' as const },
  { title: 'A caminho', Icon: Truck, state: 'todo' as const },
]

export function OrderTimeline() {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">
        Próximos passos
      </h3>

      {/* trilho horizontal: linha de fundo + progresso até o nó ativo */}
      <div className="relative grid grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-[13px] h-[3px] rounded-full bg-nxborder"
        />
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] top-[13px] h-[3px] w-1/4 rounded-full bg-store"
        />

        {STEPS.map((step) => (
          <div key={step.title} className="relative z-[1] px-1 text-center">
            <span
              className={cn(
                'mx-auto flex h-7 w-7 items-center justify-center rounded-full border-[2.5px]',
                step.state === 'done' && 'border-store bg-store text-white',
                step.state === 'active' &&
                  'border-store bg-white text-store-ink shadow-[0_0_0_5px_hsl(var(--store-accent)/0.08)]',
                step.state === 'todo' && 'border-nxborder bg-white text-nxi3',
              )}
            >
              <step.Icon size={12} strokeWidth={2.6} />
            </span>
            <p
              className={cn(
                'mt-2 text-[11.5px] font-bold leading-tight',
                step.state === 'todo' ? 'text-nxi3' : 'text-nxi1',
              )}
            >
              {step.title}
            </p>
            {step.state === 'active' && (
              <p className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-store-ink">
                agora
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
