'use client'

import Image from 'next/image'
import { Heart, Plus, ArrowRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/imageUtils'
import { formatBRL, getProductPrice, isNewProduct } from '@/lib/storefront'
import { getColorHex } from '@/schemas'
import { Stars } from '../Product'
import { EmptyImageState } from '@/components/Product'
import { productColors, productHasVariations } from '../StoreHomeCard'
import { StoreBadge } from '../ui'

interface PlpListRowProps {
  product: Product
  wished: boolean
  onOpen: () => void
  onQuickAdd: () => void
  onToggleWishlist: () => void
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2'

/** Card horizontal da view em lista da PLP. */
export function PlpListRow({ product, wished, onOpen, onQuickAdd, onToggleWishlist }: PlpListRowProps) {
  const imageUrl = getProductImageUrl(product)
  const price = getProductPrice(product)
  const hasPromo = !!(
    product.promo_active &&
    product.discount_percentage &&
    product.discount_percentage > 0
  )
  const isNew = isNewProduct(product.created_at)
  const soldOut = product.stock <= 0
  const hasVariations = productHasVariations(product)
  const reviews = product.total_reviews ?? 0
  const colors = productColors(product)
  const genero = product.dynamic_fields?.find((f) => f.field_name === 'Gênero')?.value
  const eyebrow = [product.category?.name, genero].filter(Boolean).join(' · ')

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className={cn(
        'group grid grid-cols-[110px_1fr] items-center gap-4 rounded-[18px] border border-nxborder bg-nxsurf p-3 text-left transition-colors hover:border-store/40 sm:grid-cols-[150px_1fr_auto] sm:gap-5 sm:p-3',
        focusRing,
      )}
    >
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden rounded-xl bg-nxbg sm:aspect-square sm:h-[130px] sm:w-[150px]">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill sizes="150px" className="object-cover" />
        ) : (
          <EmptyImageState iconSize="sm" className="rounded-none" />
        )}
        {hasPromo ? (
          <StoreBadge tone="promo" className="absolute left-2 top-2 px-2 py-[3px] text-[10px]">
            -{Math.round(product.discount_percentage!)}%
          </StoreBadge>
        ) : isNew ? (
          <StoreBadge tone="new" className="absolute left-2 top-2 px-2 py-[3px] text-[10px]">
            Novo
          </StoreBadge>
        ) : null}
      </div>

      <div className="min-w-0">
        {eyebrow && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-nxi3">
            {eyebrow}
          </span>
        )}
        <p className="mt-0.5 line-clamp-1 text-[16px] font-bold tracking-[-0.01em] text-nxi1 sm:text-[17px]">
          {product.name}
        </p>
        {product.description && (
          <p className="mt-1 line-clamp-2 hidden max-w-[440px] text-[13.5px] leading-relaxed text-nxi2 sm:block">
            {product.description}
          </p>
        )}
        {reviews > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.average_rating ?? 0} size={12} />
            <span className="text-[11px] font-semibold text-nxi2">
              {(product.average_rating ?? 0).toFixed(1)}{' '}
              <span className="font-normal text-nxi3">({reviews})</span>
            </span>
          </div>
        )}
        {colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-black/10"
                style={{ background: getColorHex(c) }}
              />
            ))}
          </div>
        )}
        {/* preço + ações — abaixo do conteúdo no mobile, coluna própria no desktop */}
        <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
          <PriceBlock price={price} hasPromo={hasPromo} original={product.price} />
          <WishlistButton wished={wished} onToggle={onToggleWishlist} />
        </div>
      </div>

      <div className="col-span-2 flex items-center gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:gap-3">
        <div className="hidden sm:block">
          <PriceBlock price={price} hasPromo={hasPromo} original={product.price} />
        </div>
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <div className="hidden sm:block">
            <WishlistButton wished={wished} onToggle={onToggleWishlist} />
          </div>
          {!soldOut && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (hasVariations) onOpen()
                else onQuickAdd()
              }}
              className={cn(
                'flex h-11 items-center justify-center gap-2 rounded-xl bg-store px-5 text-[13.5px] font-bold text-white transition-transform active:scale-[0.97]',
                focusRing,
              )}
            >
              {hasVariations ? (
                <>
                  Ver opções <ArrowRight size={15} />
                </>
              ) : (
                <>
                  <Plus size={15} /> Adicionar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PriceBlock({
  price,
  hasPromo,
  original,
}: {
  price: number
  hasPromo: boolean
  original: string
}) {
  return (
    <div className="text-left sm:text-right">
      <div className="text-[17px] font-extrabold text-nxi1 sm:text-[19px]">{formatBRL(price)}</div>
      {hasPromo && (
        <div className="text-[12px] text-nxi3 line-through">{formatBRL(parseFloat(original))}</div>
      )}
    </div>
  )
}

function WishlistButton({ wished, onToggle }: { wished: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={wished}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-xl border border-nxborder transition-colors',
        focusRing,
        wished ? 'text-nxd' : 'text-nxi3 hover:text-nxd',
      )}
    >
      <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
    </button>
  )
}
