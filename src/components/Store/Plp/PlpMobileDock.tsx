'use client'

import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionSort } from '@/types/store'

interface PlpMobileDockProps {
  activeCount: number
  sort: CollectionSort
  onSortChange: (s: CollectionSort) => void
  onOpenDrawer: () => void
}

const SORTS: [CollectionSort, string][] = [
  ['relevancia', 'Relevância'],
  ['menor', 'Menor preço'],
  ['maior', 'Maior preço'],
  ['avaliados', 'Mais avaliados'],
  ['nome', 'Nome (A–Z)'],
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2'

/**
 * Dock flutuante de filtros/ordenação — só abaixo de lg (onde a rail de
 * filtros do desktop fica oculta). "Ordenar" usa um <select> nativo
 * transparente sobre o botão estilizado (mesmo truque do seletor de cor da
 * Vitrine) para abrir o picker nativo do sistema ao toque.
 */
export function PlpMobileDock({ activeCount, sort, onSortChange, onOpenDrawer }: PlpMobileDockProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-7 lg:hidden"
      role="toolbar"
      aria-label="Filtrar e ordenar produtos"
    >
      <button
        type="button"
        onClick={onOpenDrawer}
        className={cn(
          'flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-store text-[14px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(7,8,21,0.35)] transition-transform active:scale-[0.98]',
          focusRing,
        )}
      >
        <SlidersHorizontal size={16} /> Filtros
        {activeCount > 0 && (
          <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-store-ink">
            {activeCount}
          </span>
        )}
      </button>

      <div className="relative flex-1">
        <div
          aria-hidden
          className="flex h-12 items-center justify-center gap-1.5 rounded-full border border-nxborder bg-white text-[14px] font-bold text-nxi1 shadow-[0_10px_28px_-8px_rgba(7,8,21,0.16)]"
        >
          Ordenar
          <ChevronDown size={15} className="text-nxi3" />
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as CollectionSort)}
          aria-label="Ordenar produtos"
          className={cn('absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0', focusRing)}
        >
          {SORTS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
