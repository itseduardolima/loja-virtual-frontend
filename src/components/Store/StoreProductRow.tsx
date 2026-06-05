'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Product } from '@/types/product'
import { StoreHomeCard } from './StoreHomeCard'
import { StoreSectionHeader } from './StoreSectionHeader'

interface StoreProductRowProps {
  id?: string
  eyebrow: string
  title: string
  products: Product[]
  loading?: boolean
  onOpen: (product: Product) => void
  onQuickAdd: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  isWished: (productId: number) => boolean
}

export function StoreProductRow({
  id,
  eyebrow,
  title,
  products,
  loading,
  onOpen,
  onQuickAdd,
  onToggleWishlist,
  isWished,
}: StoreProductRowProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (!loading && products.length === 0) return null

  return (
    <section id={id} className="mx-auto max-w-[1180px] scroll-mt-28 px-4 pt-14 md:px-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <StoreSectionHeader eyebrow={eyebrow} title={title} />
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-nxborder text-nxi2 transition-colors hover:border-nxp hover:text-nxp"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próximo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-nxborder text-nxi2 transition-colors hover:border-nxp hover:text-nxp"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-[220px] flex-shrink-0 animate-pulse rounded-2xl bg-nxbg"
            />
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[220px] flex-none snap-start">
              <StoreHomeCard
                product={product}
                onOpen={() => onOpen(product)}
                onQuickAdd={() => onQuickAdd(product)}
                onToggleWishlist={() => onToggleWishlist(product)}
                wished={isWished(product.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
