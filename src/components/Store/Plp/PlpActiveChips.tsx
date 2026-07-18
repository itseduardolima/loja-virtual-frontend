'use client'

import { X } from 'lucide-react'
import type { PlpChip } from './types'

interface PlpActiveChipsProps {
  chips: PlpChip[]
  onClearAll: () => void
}

/** Faixa de chips dos filtros ativos com remoção individual + limpar tudo */
export function PlpActiveChips({ chips, onClearAll }: PlpActiveChipsProps) {
  return (
    <div className="mb-5 -mx-4 flex items-center gap-2.5 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex h-[34px] flex-none items-center gap-2 whitespace-nowrap rounded-full border border-store/30 bg-store/[0.08] pl-3.5 pr-1.5 text-[13px] font-bold text-store-ink"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`Remover ${chip.label}`}
            className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-store/[0.16] text-store-ink transition-colors hover:bg-store/[0.26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-1"
          >
            <X size={11} strokeWidth={3} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 flex-none font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-nxd transition-colors hover:text-nxd/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxd/40 focus-visible:ring-offset-2"
      >
        Limpar tudo
      </button>
    </div>
  )
}
