'use client'

import {
  ChevronDown,
  Grid3x3,
  LayoutGrid,
  List,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionSort } from '@/types/store'
import type { PlpView } from './types'

interface PlpToolbarProps {
  resultCount: number
  activeCount: number
  sort: CollectionSort
  onSortChange: (s: CollectionSort) => void
  view: PlpView
  onViewChange: (v: PlpView) => void
  onOpenDrawer: () => void
}

const SORTS: [CollectionSort, string][] = [
  ['relevancia', 'Relevância'],
  ['menor', 'Menor preço'],
  ['maior', 'Maior preço'],
  ['avaliados', 'Mais avaliados'],
  ['nome', 'Nome (A–Z)'],
]

const VIEWS: [PlpView, LucideIcon, string][] = [
  ['grid', LayoutGrid, 'Grade padrão'],
  ['dense', Grid3x3, 'Grade compacta'],
  ['list', List, 'Lista'],
]

/** Barra de controles: filtros (mobile), contagem, ordenação e modo de visualização */
export function PlpToolbar({
  resultCount,
  activeCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenDrawer,
}: PlpToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <button
        onClick={onOpenDrawer}
        className="flex items-center gap-2 rounded-full border border-nxborder px-3.5 py-2 text-[12.5px] font-bold text-nxi1 lg:hidden"
      >
        <SlidersHorizontal size={15} /> Filtros
        {activeCount > 0 && (
          <span className="rounded-full bg-nxp px-1.5 text-[10px] text-white">{activeCount}</span>
        )}
      </button>

      <span className="hidden text-[12.5px] text-nxi3 sm:block">{resultCount} resultados</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as CollectionSort)}
            className="h-9 appearance-none rounded-full border border-nxborder bg-white pl-4 pr-9 text-[12.5px] font-semibold text-nxi2 focus:border-nxp focus:outline-none"
          >
            {SORTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-nxi3"
          />
        </div>

        <div className="hidden gap-0.5 rounded-full bg-nxbg p-0.5 sm:flex">
          {VIEWS.map(([value, Icon, label]) => (
            <button
              key={value}
              onClick={() => onViewChange(value)}
              aria-label={label}
              className={cn(
                'flex h-8 w-9 items-center justify-center rounded-full transition-all',
                view === value ? 'bg-white text-nxi1 shadow-sm' : 'text-nxi3',
              )}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
