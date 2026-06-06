'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/imageUtils'
import { formatBRL, getProductPrice } from '@/lib/storefront'
import { getColorHex } from '@/schemas'
import { Stars } from '../Product'
import { EmptyImageState } from '@/components/Product'
import { productColors } from '../StoreHomeCard'

interface PlpListRowProps {
  product: Product
  wished: boolean
  onOpen: () => void
  onToggleWishlist: () => void
}

/** Card horizontal da view em lista da PLP. */
export function PlpListRow({ product, wished, onOpen, onToggleWishlist }: PlpListRowProps) {
  const imageUrl = getProductImageUrl(product)
  const hasPromo = !!(
    product.promo_active &&
    product.discount_percentage &&
    product.discount_percentage > 0
  )
  const reviews = product.total_reviews ?? 0
  const colors = productColors(product)
  // campo dinâmico "Gênero" concatenado no eyebrow, quando existir
  const genero = product.dynamic_fields?.find((f) => f.field_name === 'Gênero')?.value
  const eyebrow = [product.category?.name, genero].filter(Boolean).join(' · ')

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-nxborder bg-white p-3 text-left transition-colors hover:border-nxp/40"
    >
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-nxbg">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
        ) : (
          <EmptyImageState iconSize="sm" className="rounded-none" />
        )}
        {hasPromo && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-nxa px-1.5 py-0.5 text-[9px] font-bold text-white">
            -{Math.round(product.discount_percentage!)}%
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {eyebrow && (
          <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-nxi3">
            {eyebrow}
          </span>
        )}
        <p className="mt-0.5 line-clamp-1 text-[15px] font-bold tracking-[-0.01em] text-nxi1">
          {product.name}
        </p>
        {reviews > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            <Stars rating={product.average_rating ?? 0} size={11} />
            <span className="text-[10px] text-nxi3">({reviews})</span>
          </div>
        )}
        {colors.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10"
                style={{ background: getColorHex(c) }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <div className="text-[16px] font-extrabold text-nxi1">
            {formatBRL(getProductPrice(product))}
          </div>
          {hasPromo && (
            <div className="text-[11px] text-nxi3 line-through">
              {formatBRL(parseFloat(product.price))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist()
          }}
          aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={wished}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border border-nxborder transition-colors',
            wished ? 'text-nxd' : 'text-nxi3 hover:text-nxd',
          )}
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}
