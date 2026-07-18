'use client'

import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { StoreHomeCard } from '../StoreHomeCard'
import { PlpListRow } from './PlpListRow'
import type { PlpView } from './types'

interface PlpProductGridProps {
  products: Product[]
  view: PlpView
  loading?: boolean
  isWished: (id: number) => boolean
  onOpen: (p: Product) => void
  onQuickAdd: (p: Product) => void
  onToggleWishlist: (p: Product) => void
}

/** Grid (normal/denso), lista ou skeleton de carregamento da PLP. */
export function PlpProductGrid({
  products,
  view,
  loading,
  isWished,
  onOpen,
  onQuickAdd,
  onToggleWishlist,
}: PlpProductGridProps) {
  if (loading) {
    if (view === 'list') {
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid animate-pulse grid-cols-[110px_1fr] gap-4 rounded-[18px] border border-nxborder bg-nxsurf p-3 sm:grid-cols-[150px_1fr_auto] sm:gap-5"
            >
              <div className="aspect-[4/5] rounded-xl bg-nxbg sm:aspect-square sm:h-[130px] sm:w-[150px]" />
              <div className="flex flex-col justify-center gap-2.5">
                <div className="h-2.5 w-1/4 rounded bg-nxbg" />
                <div className="h-4 w-3/4 rounded bg-nxbg" />
                <div className="h-3 w-1/3 rounded bg-nxbg" />
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div
        className={cn(
          'grid gap-2.5 md:gap-3',
          view === 'dense'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-[20px] border border-nxborder bg-nxsurf"
          >
            <div className="aspect-[3/4] bg-nxbg" />
            <div className="flex flex-col gap-2 px-3.5 pb-3.5 pt-3">
              <div className="h-2.5 w-1/3 rounded bg-nxbg" />
              <div className="h-3.5 w-full rounded bg-nxbg" />
              <div className="h-3.5 w-1/2 rounded bg-nxbg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="plp-rise"
            style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}
          >
            <PlpListRow
              product={p}
              wished={isWished(p.id)}
              onOpen={() => onOpen(p)}
              onQuickAdd={() => onQuickAdd(p)}
              onToggleWishlist={() => onToggleWishlist(p)}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-2.5 md:gap-3',
        view === 'dense'
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {products.map((p, i) => (
        <div
          key={p.id}
          className="plp-rise"
          style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}
        >
          <StoreHomeCard
            product={p}
            eyebrow={p.category?.name}
            dense={view === 'dense'}
            onOpen={() => onOpen(p)}
            onQuickAdd={() => onQuickAdd(p)}
            onToggleWishlist={() => onToggleWishlist(p)}
            wished={isWished(p.id)}
          />
        </div>
      ))}
    </div>
  )
}
