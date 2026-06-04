'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { EmptyImageState } from '@/components/Product/EmptyImageState'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  discountPercentage?: number
  buildImageUrls: (images: string[]) => string[]
  galleryKey?: string // muda ao trocar de cor — reinicia a animação de entrada
}

function DiscountBadge({ value }: { value?: number }) {
  if (!value || value <= 0) return null
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-nxa px-2.5 py-1 text-[11px] font-bold text-white">
      -{Math.floor(value)}%
    </span>
  )
}

export function ProductImageGallery({
  images,
  productName,
  discountPercentage,
  buildImageUrls,
  galleryKey,
}: ProductImageGalleryProps) {
  const [mobileIndex, setMobileIndex] = useState(0)
  const urls = buildImageUrls(images)

  if (urls.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-nxborder">
        <EmptyImageState iconSize="md" />
      </div>
    )
  }

  return (
    <div>
      {/* mobile: imagem única ou swipe com dots */}
      <div className="lg:hidden">
        {urls.length === 1 ? (
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-nxborder bg-nxbg">
            <DiscountBadge value={discountPercentage} />
            <Image
              src={urls[0]}
              alt={productName}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ) : (
          <>
            <div
              className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden"
              onScroll={(e) => {
                const el = e.currentTarget
                setMobileIndex(Math.round(el.scrollLeft / (el.clientWidth * 0.88 + 8)))
              }}
            >
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] w-[88%] shrink-0 snap-center overflow-hidden rounded-xl border border-nxborder bg-nxbg"
                >
                  {index === 0 && <DiscountBadge value={discountPercentage} />}
                  <Image
                    src={url}
                    alt={`${productName} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="88vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-1.5">
              {urls.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === mobileIndex ? 'w-5 bg-nxp' : 'w-1.5 bg-nxborder',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* desktop: stack vertical */}
      <div key={galleryKey} className="nx-gallery-swap hidden flex-col gap-3 lg:flex">
        {urls.map((url, index) => (
          <div
            key={index}
            className={cn(
              'relative w-full overflow-hidden rounded-xl border border-nxborder bg-nxbg',
              urls.length > 1 && index === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]',
            )}
          >
            {index === 0 && <DiscountBadge value={discountPercentage} />}
            <Image
              src={url}
              alt={`${productName} ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
