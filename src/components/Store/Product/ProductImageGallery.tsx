'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildImageUrl } from '@/lib/utils'
import { EmptyImageState } from '@/components/Product/EmptyImageState'
import { ProductImageZoom } from '@/components/Product/ProductImageZoom'

interface ProductImageGalleryProps {
  images: string[]
  selectedIndex: number
  productName: string
  buildImageUrls: (images: string[]) => string[]
  onSelectImage: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function ProductImageGallery({
  images,
  selectedIndex,
  productName,
  buildImageUrls,
  onSelectImage,
  onPrevious,
  onNext,
}: ProductImageGalleryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {images.length > 1 && (
        <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`relative rounded-lg sm:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300 active:border-primary'
              }`}
            >
              <Image
                src={buildImageUrl(image)}
                alt={`${productName} ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px]"
                sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 100px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="w-full sm:flex-1 relative rounded-2xl overflow-hidden order-1 sm:order-2 min-w-0 h-[60vh] sm:h-auto">
        {images.length > 0 ? (
          <>
            <ProductImageZoom
              src={buildImageUrls(images)[selectedIndex]}
              alt={productName}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all active:scale-95 lg:hidden z-10 touch-manipulation"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all active:scale-95 lg:hidden z-10 touch-manipulation"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden z-10">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        selectedIndex === index ? 'w-6 bg-primary' : 'w-2 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <EmptyImageState iconSize="md" />
        )}
      </div>
    </div>
  )
}
