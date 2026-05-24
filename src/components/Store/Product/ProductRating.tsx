'use client'

import { Star } from 'lucide-react'

interface ProductRatingProps {
  rating: number
  totalReviews: number
}

export function ProductRating({ rating, totalReviews }: ProductRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <span className="relative inline-block h-4 w-4 sm:h-5 sm:w-5">
            <Star className="absolute inset-0 h-full w-full text-gray-300" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-full w-full fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
        ))}
      </div>
      <span className="text-xs sm:text-sm text-primary/60">
        {totalReviews
          ? `(${rating.toFixed(1)}) · ${totalReviews} ${totalReviews === 1 ? 'avaliação' : 'avaliações'}`
          : '(Sem avaliações)'}
      </span>
    </div>
  )
}
