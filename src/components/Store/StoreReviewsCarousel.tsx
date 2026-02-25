'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { StoreReview } from '@/types/review'
import { StoreReviewCard } from './StoreReviewCard'

interface StoreReviewsCarouselProps {
  reviews: StoreReview[]
}

export function StoreReviewsCarousel({ reviews }: StoreReviewsCarouselProps) {
  const [page, setPage] = useState(0)
  const itemsPerPage = 4

  if (reviews.length === 0) return null

  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage))
  const safePage = Math.min(page, totalPages - 1)
  const startIndex = safePage * itemsPerPage
  const visible = reviews.slice(startIndex, startIndex + itemsPerPage)

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  return (
    <div className="mt-10">
      {totalPages > 1 && (
        <div className="flex justify-end mb-5">
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={handlePrev}
              aria-label="Comentários anteriores"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={handleNext}
              aria-label="Próximos comentários"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {visible.map((review) => (
          <StoreReviewCard key={review.id} review={review} />
        ))}

      </div>


    </div>
  )
}

