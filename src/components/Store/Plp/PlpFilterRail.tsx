'use client'

import type { ReactNode } from 'react'

interface PlpFilterRailProps {
  activeCount: number
  onClearAll: () => void
  children: ReactNode
}

/** Coluna de filtros fixa no desktop (oculta no mobile) */
export function PlpFilterRail({ activeCount, onClearAll, children }: PlpFilterRailProps) {
  return (
    <aside className="hidden w-[264px] shrink-0 lg:block">
      <div className="sticky top-[128px]">
        <div className="mb-1.5 flex items-center justify-between">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-nxi1">
            Filtros
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-nxd transition-colors hover:text-nxd/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxd/40 focus-visible:ring-offset-2"
            >
              Limpar ({activeCount})
            </button>
          )}
        </div>
        <div className="scrollbar-thin max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </aside>
  )
}
