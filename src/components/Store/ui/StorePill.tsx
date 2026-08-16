'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StorePillProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  active?: boolean
  /** contagem opcional exibida ao lado do rótulo (ex.: categorias/filtros) */
  count?: number | null
  children: ReactNode
}

/** Pílula selecionável (categorias, filtros ativos, chips). Accent do lojista quando ativa. */
export function StorePill({ active = false, count, className, children, ...rest }: StorePillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-11 flex-none items-center gap-1.5 rounded-full px-5 text-[14px] font-bold whitespace-nowrap transition-[background,border-color,color] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
        active
          ? 'bg-store text-white shadow-[0_10px_24px_-12px_rgba(7,8,21,0.45)]'
          : 'border border-nxborder bg-white text-nxi1 hover:bg-nxbg',
        className,
      )}
      {...rest}
    >
      {children}
      {count != null && count > 0 && (
        <span className={cn('font-semibold', active ? 'text-white/70' : 'text-nxi3')}>{count}</span>
      )}
    </button>
  )
}
