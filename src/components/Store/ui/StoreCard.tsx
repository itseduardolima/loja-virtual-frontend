'use client'

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/** Classe base da superfície de card da vitrine (off-white + borda hairline + raio 20). */
export function storeCardClass(opts: { interactive?: boolean } = {}) {
  return cn(
    'overflow-hidden rounded-[20px] border border-nxborder bg-nxsurf',
    opts.interactive &&
      'transition-shadow duration-300 hover:shadow-[0_18px_44px_-20px_rgba(7,8,21,0.35)]',
  )
}

interface StoreCardProps extends ComponentPropsWithoutRef<'div'> {
  /** aplica sombra no hover (cards clicáveis) */
  interactive?: boolean
}

/** Superfície de card reutilizável (produtos, blocos de conteúdo, resumos). */
export const StoreCard = forwardRef<HTMLDivElement, StoreCardProps>(function StoreCard(
  { interactive = false, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(storeCardClass({ interactive }), className)} {...rest}>
      {children}
    </div>
  )
})
