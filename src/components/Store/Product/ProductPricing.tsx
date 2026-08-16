'use client'

import { formatPrice } from '@/lib/utils'

interface ProductPricingProps {
  finalPrice: number | string
  originalPrice: string
  discountPercentage: number
}

export function ProductPricing({ finalPrice, originalPrice, discountPercentage }: ProductPricingProps) {
  const hasDiscount = discountPercentage > 0
  return (
    <div className="flex flex-wrap items-end gap-3">
      <span className="text-[40px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">
        {formatPrice(finalPrice?.toString() || originalPrice)}
      </span>
      {hasDiscount && (
        <span className="mb-1 text-[18px] font-medium text-nxi3 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  )
}
