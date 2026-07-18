'use client'

import { ChevronDown, Grid3x3, LayoutGrid, List, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionSort } from '@/types/store'
import type { PlpView } from './types'

interface PlpToolbarProps {
  title: string
  resultCount: number
  sort: CollectionSort
  onSortChange: (s: CollectionSort) => void
  view: PlpView
  onViewChange: (v: PlpView) => void
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

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2'

/**
 * Sub-barra sticky da PLP: título + contagem (sempre visível) e, a partir de
 * lg (a rail de filtros já visível), ordenação + densidade. Abaixo de lg,
 * filtros/ordenação vivem no PlpMobileDock flutuante.
 */
export function PlpToolbar({
  title,
  resultCount,
  sort,
  onSortChange,
  view,
  onViewChange,
}: PlpToolbarProps) {
  return (
    <div className="sticky top-16 z-40 border-y border-nxborder bg-nxsurf/92 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-store items-center justify-between gap-3 px-4 py-3 md:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-[15px] font-extrabold text-nxi1">{title}</span>
          <span className="h-1 w-1 flex-none rounded-full bg-nxborder" />
          <span className="whitespace-nowrap text-[13px] text-nxi3">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="hidden flex-none items-center gap-2.5 lg:flex">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as CollectionSort)}
              aria-label="Ordenar produtos"
              className={cn(
                'h-10 appearance-none rounded-[10px] border border-nxborder bg-white pl-3.5 pr-9 text-[13px] font-bold text-nxi1 transition-colors hover:border-nxi3',
                focusRing,
              )}
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

          <div className="flex gap-0.5 rounded-xl bg-nxbg p-[3px]">
            {VIEWS.map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onViewChange(value)}
                aria-label={label}
                aria-pressed={view === value}
                className={cn(
                  'flex h-[38px] w-10 items-center justify-center rounded-[9px] transition-all',
                  focusRing,
                  view === value ? 'bg-white text-nxi1 shadow-sm' : 'text-nxi3 hover:text-nxi2',
                )}
              >
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
