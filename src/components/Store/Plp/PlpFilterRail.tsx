'use client'

import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'

interface PlpFilterRailProps {
  activeCount: number
  onClearAll: () => void
  children: ReactNode
}

/** Coluna de filtros fixa no desktop (oculta no mobile) */
export function PlpFilterRail({ activeCount, onClearAll, children }: PlpFilterRailProps) {
  return (
    <aside className="hidden w-[244px] shrink-0 lg:block">
      <div className="sticky top-[88px]">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-extrabold text-nxi1">
            <SlidersHorizontal size={15} /> Filtros
          </h2>
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11.5px] font-bold text-nxp hover:underline"
            >
              Limpar ({activeCount})
            </button>
          )}
        </div>
        <div className="scrollbar-thin max-h-[calc(100vh-130px)] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </aside>
  )
}
