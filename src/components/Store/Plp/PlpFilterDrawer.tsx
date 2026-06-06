'use client'

import type { ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

interface PlpFilterDrawerProps {
  open: boolean
  onClose: () => void
  resultCount: number
  onClearAll: () => void
  children: ReactNode
}

/** Drawer de filtros do mobile (entra pela esquerda) */
export function PlpFilterDrawer({
  open,
  onClose,
  resultCount,
  onClearAll,
  children,
}: PlpFilterDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <div
        className="absolute inset-0 bg-nxi1/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plp-filter-drawer-title"
        className="plp-drawer absolute left-0 top-0 flex h-full w-full max-w-[360px] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-nxborder px-5 py-4">
          <h2
            id="plp-filter-drawer-title"
            className="flex items-center gap-2 text-[15px] font-extrabold text-nxi1"
          >
            <SlidersHorizontal size={16} /> Filtros
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar filtros"
            className="flex h-8 w-8 items-center justify-center rounded-full text-nxi3 hover:bg-nxbg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5">{children}</div>

        <div className="flex gap-2 border-t border-nxborder px-5 py-4">
          <button
            onClick={onClearAll}
            className="h-11 rounded-full border border-nxborder px-5 text-[13px] font-semibold text-nxi2"
          >
            Limpar
          </button>
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-full bg-nxp text-[13.5px] font-bold text-white"
          >
            Ver {resultCount} produtos
          </button>
        </div>
      </div>
    </div>
  )
}
