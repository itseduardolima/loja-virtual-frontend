'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Product } from '@/types/product'
import { StoreIconButton } from '@/components/Store/ui'
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
  showWishlist?: boolean
}

/**
 * Bespoke sobre o StoreIconButton (que já entrega alvo 44px, foco e semântica):
 * restaura o visual da seta — pill outline com accent do lojista no hover.
 */
const NAV_BTN =
  'rounded-full border border-nxborder text-nxi2 transition-colors hover:bg-transparent hover:border-store hover:text-store'

/**
 * Seção "row" da vitrine (Novidades / Ofertas): cabeçalho editorial +
 * faixa horizontal rolável de cards, com máscara de gradiente nas bordas.
 */
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
  showWishlist = true,
}: StoreProductRowProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (!loading && products.length === 0) return null

  return (
    <section id={id} className="mx-auto max-w-store scroll-mt-28 px-4 pt-14 md:px-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <StoreSectionHeader eyebrow={eyebrow} title={title} />
        <div className="hidden items-center gap-2 sm:flex">
          <StoreIconButton
            variant="ghost"
            aria-label="Anterior"
            onClick={() => scroll(-1)}
            className={NAV_BTN}
          >
            <ArrowLeft size={18} />
          </StoreIconButton>
          <StoreIconButton
            variant="ghost"
            aria-label="Próximo"
            onClick={() => scroll(1)}
            className={NAV_BTN}
          >
            <ArrowRight size={18} />
          </StoreIconButton>
        </div>
      </div>

      {loading ? (
        <div className="edge-fade-x -mx-4 flex gap-5 overflow-hidden px-4 md:-mx-10 md:px-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-[250px] flex-none animate-pulse rounded-[20px] bg-nxbg"
            />
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="edge-fade-x -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[250px] flex-none snap-start">
              <StoreHomeCard
                product={product}
                onOpen={() => onOpen(product)}
                onQuickAdd={() => onQuickAdd(product)}
                onToggleWishlist={() => onToggleWishlist(product)}
                wished={isWished(product.id)}
                showWishlist={showWishlist}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
