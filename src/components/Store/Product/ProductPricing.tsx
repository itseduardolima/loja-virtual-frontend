'use client'

import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface ProductPricingProps {
  finalPrice: number | string
  originalPrice: string
  discountPercentage: number
}

export function ProductPricing({ finalPrice, originalPrice, discountPercentage }: ProductPricingProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
        {formatPrice(finalPrice?.toString() || originalPrice)}
      </span>
      {discountPercentage > 0 && (
        <>
          <span className="text-lg sm:text-xl lg:text-2xl text-primary/30 line-through font-bold">
            {formatPrice(originalPrice)}
          </span>
          <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-1 text-xs sm:text-sm">
            -{Math.floor(discountPercentage)}%
          </Badge>
        </>
      )}
    </div>
  )
}
