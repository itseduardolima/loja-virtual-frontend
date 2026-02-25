'use client'

import { buildImageUrl } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { StoreReview } from '@/types/review'

interface StoreReviewCardProps {
  review: StoreReview
}

export function StoreReviewCard({ review }: StoreReviewCardProps) {
  const fullStars = Math.round(review.rating)
  const productImage = review.product?.image || null

  return (
    <article className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-1 text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        {productImage && (
          <img
            src={buildImageUrl(productImage)}
            alt={review.product?.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
        )}
      </div>

      <p className="text-sm text-gray-700 flex-1">
        “
        {review.comment && review.comment.trim().length > 0
          ? review.comment
          : 'Cliente avaliou esta loja com excelente nota.'}
        ”
      </p>

      

      <div className="mt-4">
        <p className="font-semibold text-gray-900">{review.user.name}</p>
        <p className="text-xs text-gray-500">{review.product?.name}</p>
      </div>
    </article>
  )
}

