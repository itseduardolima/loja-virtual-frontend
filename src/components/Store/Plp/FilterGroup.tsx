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
    <div className="border-t border-nxborder py-[18px] first:border-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 rounded-md"
      >
        <span className="flex items-center gap-2 text-[14px] font-extrabold text-nxi1">
          {title}
          {count != null && count > 0 && (
            <span className="rounded-[6px] bg-nxbg px-[7px] py-[2px] font-mono text-[11px] text-nxi3">
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
