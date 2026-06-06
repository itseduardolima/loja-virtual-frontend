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
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.remove}
          className="inline-flex items-center gap-1.5 rounded-full bg-nxp/[0.07] px-3 py-1.5 text-[12px] font-semibold text-nxp transition-colors hover:bg-nxp/[0.12]"
        >
          {chip.label}
          <X size={13} />
        </button>
      ))}
      <button onClick={onClearAll} className="text-[12px] font-bold text-nxi3 hover:text-nxd">
        Limpar tudo
      </button>
    </div>
  )
}
