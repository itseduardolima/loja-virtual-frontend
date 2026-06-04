'use client'

// CompletionMeter — espelha o CompletionMeter de aside.jsx: anel SVG de
// progresso (strokeDasharray dinâmico via style, permitido para runtime),
// % no centro, "X/Y seções preenchidas", checklist com links de âncora.
import { Check } from 'lucide-react'
import type { CompletionItem } from './types'
import { cn } from '@/lib/utils'

// circunferência do anel: 2π·r, r = 15.5
const CIRC = 97.4

export function CompletionMeter({ items }: { items: CompletionItem[] }) {
  const total = items.length
  const done = items.filter((i) => i.done).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const ready = total > 0 && done === total

  return (
    <div className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="hsl(var(--nxborder))"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={ready ? 'hsl(var(--nxs))' : 'hsl(var(--nxp))'}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * CIRC} ${CIRC}`}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[12px] font-extrabold text-nxi1">
            {pct}%
          </span>
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-nxi1">
            {done}/{total} seções preenchidas
          </div>
          <div className="text-[11.5px] text-nxi2">
            {ready ? 'Tudo pronto para publicar 🎉' : 'Complete para aumentar as vendas.'}
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={`#${item.anchor}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors hover:bg-nxbg"
            >
              <span
                className={cn(
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full',
                  item.done
                    ? 'bg-nxs text-white'
                    : item.required
                      ? 'border-2 border-nxa/50'
                      : 'border-2 border-nxborder',
                )}
              >
                {item.done && <Check size={11} strokeWidth={3} />}
              </span>
              <span className={cn('flex-1 font-medium', item.done ? 'text-nxi2' : 'text-nxi1')}>
                {item.label}
              </span>
              {!item.done && item.required && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-nxa">
                  obrigatório
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
