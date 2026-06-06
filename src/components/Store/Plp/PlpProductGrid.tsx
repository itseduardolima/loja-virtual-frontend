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
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-nxbg" />
        ))}
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
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
