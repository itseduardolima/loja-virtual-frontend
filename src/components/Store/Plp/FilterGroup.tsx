'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterGroupProps {
  title: string
  /** badge de contagem de seleções ativas (renderiza só quando > 0) */
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}

/** Seção colapsável do painel de filtros */
export function FilterGroup({ title, count, defaultOpen = true, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-nxborder py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.06em] text-nxi1">
          {title}
          {count != null && count > 0 && (
            <span className="rounded-full bg-nxp/10 px-1.5 py-0.5 text-[10px] font-bold text-nxp">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn('text-nxi3 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  )
}
