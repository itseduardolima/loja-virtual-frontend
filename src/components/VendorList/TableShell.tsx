'use client'

import { ReactNode } from 'react'
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Container card padrão para tabelas do painel do vendedor */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      {children}
    </div>
  )
}

/** Toolbar acima da tabela (tabs + busca + selects) */
export function TableToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-nxborder p-3">{children}</div>
  )
}

/** Classe padrão do thead das tabelas */
export const thClass = 'px-2 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.05em] text-nxi3'

interface TableEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function TableEmptyState({ icon: Icon, title, description, action }: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nxbg text-nxi3">
        <Icon size={26} />
      </div>
      <h3 className="mt-4 text-[15px] font-bold text-nxi1">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] text-nxi3">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

interface TablePaginationProps {
  shown: number
  total: number
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  shown,
  total,
  currentPage,
  lastPage,
  onPageChange,
}: TablePaginationProps) {
  const pages = (() => {
    const list: number[] = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(lastPage, start + 4)
    for (let i = start; i <= end; i++) list.push(i)
    return list
  })()

  return (
    <div className="flex items-center justify-between border-t border-nxborder px-4 py-3 text-[12.5px] text-nxi3">
      <span>
        Mostrando <b className="text-nxi1">{shown}</b> de {total}
      </span>
      {lastPage > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-nxborder text-nxi3 transition-colors hover:text-nxp disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft size={15} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] font-bold transition-colors',
                p === currentPage
                  ? 'bg-nxp text-white'
                  : 'border border-nxborder text-nxi2 hover:text-nxp',
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-nxborder text-nxi3 transition-colors hover:text-nxp disabled:opacity-40"
            aria-label="Próxima página"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
