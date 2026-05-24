'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { StoreReview } from '@/types/review'
import { buildImageUrl } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface StoreReviewsSectionProps {
  reviews: StoreReview[]
  total: number
  loading: boolean
}

export function StoreReviewsSection({ reviews, total, loading }: StoreReviewsSectionProps) {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = (index: number) => {
    if (reviews.length === 0) return
    setFading(true)
    setTimeout(() => {
      setActive(((index % reviews.length) + reviews.length) % reviews.length)
      setFading(false)
    }, 180)
  }

  // Auto-advance
  useEffect(() => {
    if (reviews.length <= 1) return
    const interval = setInterval(() => {
      goTo(active + 1)
    }, 5400)
    return () => clearInterval(interval)
  }, [active, reviews.length])

  if (!loading && reviews.length === 0) return null

  if (loading) {
    return (
      <section className="py-10 md:py-20">
        <div className="max-w-[880px] mx-auto px-5 md:px-20 flex flex-col md:flex-row gap-6 md:gap-[clamp(28px,5vw,60px)] items-stretch">
          {/* Left skeleton */}
          <div className="w-full md:w-[240px] aspect-[3/4] md:aspect-auto md:flex-shrink-0 rounded-xl bg-[#e8e0d8] animate-pulse" style={{ minHeight: 180 }} />
          {/* Right skeleton */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="h-[10px] w-1/4 rounded bg-[#e8e0d8] animate-pulse" />
            <div className="h-[26px] w-[95%] rounded-md bg-[#e8e0d8] animate-pulse" />
            <div className="h-[26px] w-3/4 rounded-md bg-[#e8e0d8] animate-pulse" />
            <div className="h-[10px] w-[45%] rounded mt-2 bg-[#e8e0d8] animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  const review = reviews[active]

  const dateStr = (() => {
    try {
      return format(new Date(review.created_at), "d 'de' MMM. yyyy", { locale: ptBR })
    } catch {
      return ''
    }
  })()

  const productImageUrl = review.product?.image ? buildImageUrl(review.product.image) : null

  const counterStr = `${String(active + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`

  return (
    <section className="py-10 md:py-20">
      <div className="max-w-[880px] mx-auto px-5 md:px-20 flex flex-col md:flex-row gap-6 md:gap-[clamp(28px,5vw,60px)] items-stretch">
        {/* Left column */}
        <div className="w-full md:w-[clamp(180px,22vw,240px)] md:flex-shrink-0 flex flex-col gap-0">
          {/* Product image */}
          <div
            className="relative w-full rounded-xl overflow-hidden transition-opacity duration-300"
            style={{ opacity: fading ? 0.4 : 1, minHeight: 200, aspectRatio: '3/4' }}
          >
            {productImageUrl ? (
              <Image
                src={productImageUrl}
                alt={review.product?.name ?? ''}
                fill
                className="object-cover"
                sizes="240px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8e0d8] to-[#c4b4a4]" />
            )}
          </div>

        

          {/* Dots */}
          <div className="flex items-center justify-center gap-[5px] mt-3">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-[5px] rounded-[3px] bg-transparent border-none cursor-pointer transition-all duration-[320ms]"
                style={{
                  width: i === active ? 18 : 5,
                  background: i === active ? '#5A3C1E' : 'rgba(90,60,30,0.22)',
                }}
                aria-label={`Ir para depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col justify-center relative">
          {/* Aggregate rating */}
          <div className="flex items-center gap-3 mb-7">
            <span
              className="text-[40px] font-normal text-[#1C1008] leading-none"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {review.rating}.0
            </span>
            <div>
              <div className="flex gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={[
                      'w-[15px] h-[15px]',
                      i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200',
                    ].join(' ')}
                  />
                ))}
              </div>
              <p className="font-mono text-[11px] text-[#A8998A] mt-1 tracking-[.08em]">
                Avaliações verificadas
              </p>
            </div>
          </div>

          {/* Label */}
          <p className="font-mono text-[9px] tracking-[.22em] uppercase text-[#A8998A] mb-8">
            DEPOIMENTOS
          </p>

          {/* Decorative quote mark */}
          <div
            className="absolute top-[-8px] left-0 text-[100px] md:text-[160px] leading-none select-none pointer-events-none z-0 overflow-hidden"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: 'rgba(90,60,30,0.07)',
            }}
          >
            &ldquo;
          </div>

          {/* Quote block */}
          <div
            className="relative z-10 transition-opacity duration-300"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <blockquote
              className="text-[#1C1008] leading-[1.62] mb-7 break-words whitespace-normal"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(19px, 2.6vw, 25px)',
              }}
            >
              &ldquo;{review.comment}&rdquo;
            </blockquote>

            {/* Attribution row */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[#7C6B5C]">
                — {review.user.name}
              </span>
              <div className="w-px h-[10px] bg-[#C4B4A4] flex-shrink-0" />
              <div className="flex gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={[
                      'w-[11px] h-[11px]',
                      i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300',
                    ].join(' ')}
                  />
                ))}
              </div>
              <div className="w-px h-[10px] bg-[#C4B4A4] flex-shrink-0" />
              <span className="font-mono text-[9px] tracking-[.14em] uppercase text-[#A8998A]">
                {dateStr}
              </span>
            </div>
          </div>

          {/* Nav row */}
          <div className="flex items-center gap-3.5 mt-10">
            <button
              onClick={() => goTo(active - 1)}
              className="w-[34px] h-[34px] rounded-full bg-[#5A3C1E]/[8%] hover:bg-[#5A3C1E]/[16%] border-none cursor-pointer flex items-center justify-center text-[#5A3C1E] text-[14px] transition-colors"
              aria-label="Depoimento anterior"
            >
              ←
            </button>
            <button
              onClick={() => goTo(active + 1)}
              className="w-[34px] h-[34px] rounded-full bg-[#5A3C1E]/[8%] hover:bg-[#5A3C1E]/[16%] border-none cursor-pointer flex items-center justify-center text-[#5A3C1E] text-[14px] transition-colors"
              aria-label="Próximo depoimento"
            >
              →
            </button>
            <span className="font-mono text-[9px] tracking-[.18em] uppercase text-[#A8998A] ml-1">
              {counterStr}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
