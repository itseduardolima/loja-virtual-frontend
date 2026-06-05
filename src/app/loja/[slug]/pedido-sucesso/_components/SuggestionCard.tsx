'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import { Stars } from '@/components/Store/Product'
import { getProductImageUrl } from '@/lib/imageUtils'
import { getProductPrice } from '@/lib/storefront'
import { formatPrice } from '@/lib/utils'

interface SuggestionCardProps {
  product: Product
  onOpen: () => void
}

export function SuggestionCard({ product, onOpen }: SuggestionCardProps) {
  const imageUrl = getProductImageUrl(product)
  const effectivePrice = getProductPrice(product)
  const originalPrice = parseFloat(product.price)
  const hasPromo = !!(
    product.promo_active &&
    product.discount_percentage &&
    product.discount_percentage > 0
  )
  const discountPct = hasPromo ? Math.round(product.discount_percentage!) : 0

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-nxborder bg-white"
    >
      {/* imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-nxbg">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-nxbg" />
          )}
        </div>
        {discountPct > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-nxa px-2 py-0.5 text-[10px] font-bold text-white">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* corpo */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="line-clamp-1 text-[12.5px] font-semibold text-nxi1">{product.name}</p>

        {(product.total_reviews ?? 0) > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <Stars rating={product.average_rating ?? 0} size={11} />
            <span className="text-[10px] text-nxi3">({product.total_reviews})</span>
          </div>
        )}

        {/* preços */}
        <div className="mt-auto flex items-baseline gap-1.5 pt-2">
          <span className="text-[13px] font-bold text-nxi1">{formatPrice(effectivePrice)}</span>
          {hasPromo && (
            <span className="text-[11px] text-nxi3 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
