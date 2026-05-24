'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Product } from '@/types/product'
import { buildImageUrl } from '@/lib/utils'
import { IconHeart } from '@/assets/icons'

interface StoreEditorialCardProps {
  product: Product
  index?: number
  onViewDetails?: () => void
}

export function getProductImageUrl(product: Product): string | null {
  if (product.images_by_color) {
    const firstColor = Object.values(product.images_by_color)[0]
    if (firstColor && firstColor.length > 0) return buildImageUrl(firstColor[0])
  }
  if (product.images) {
    if (Array.isArray(product.images) && product.images.length > 0) return buildImageUrl(product.images[0])
    if (typeof product.images === 'object') {
      const firstKey = Object.values(product.images as Record<string, string[]>)[0]
      if (firstKey && firstKey.length > 0) return buildImageUrl(firstKey[0])
    }
  }
  return null
}

export function StoreEditorialCard({ product, index, onViewDetails }: StoreEditorialCardProps) {
  const imageUrl = getProductImageUrl(product)

  const price = product.final_price ?? parseFloat(product.price)
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  const originalPrice =
    product.promo_active && product.promo_price
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(product.price))
      : null
  const hasDiscount = product.promo_active && product.discount_percentage != null && product.discount_percentage > 0
  const rating = product.average_rating ?? 0
  const totalReviews = product.total_reviews ?? 0

  return (
    <div
      className="w-full h-full flex flex-col cursor-pointer group hover:border hover:border-gray-200 transition-colors"
      onClick={onViewDetails}
    >
      <div className="relative flex-1 overflow-hidden bg-transparent min-h-0">
        {imageUrl && (
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width:768px)50vw,25vw"
            />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{Math.floor(product.discount_percentage!)}%
            </span>
          </div>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full bg-white/[92%] backdrop-blur-sm border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm cursor-pointer"
          aria-label="Favoritar"
        >
          <IconHeart size={14} className="text-[#6B7280]" />
        </button>
      </div>

      <div className="flex-shrink-0 px-3 pt-[10px] pb-3 bg-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] font-semibold text-[#111] truncate min-w-0 leading-[1.3] tracking-[-0.01em]">
            {product.name}
          </p>
          <div className="flex-shrink-0 flex items-center gap-1.5">
            {originalPrice && (
              <span className="text-[11px] text-[#C0B8B0] line-through">{originalPrice}</span>
            )}
            <span className="text-[12.5px] font-bold text-[#111]">{formattedPrice}</span>
          </div>
        </div>

        <div className="mt-1.5 h-[18px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="flex items-center gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-[11px] h-[11px] ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
              {totalReviews > 0 && (
                <span className="text-[10px] text-gray-400 ml-[3px]">({totalReviews})</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
