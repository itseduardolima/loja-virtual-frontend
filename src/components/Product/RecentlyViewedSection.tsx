'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { buildImageUrl, formatPrice } from '@/lib/utils'
import { EmptyImageState } from './EmptyImageState'

interface RecentlyViewedSectionProps {
  currentProductId?: number
  storeSlug?: string
}

export function RecentlyViewedSection({ currentProductId, storeSlug }: RecentlyViewedSectionProps) {
  const { recentlyViewed } = useRecentlyViewed()
  const router = useRouter()

  const items = recentlyViewed.filter((p) => p.id !== currentProductId)

  if (items.length === 0) return null

  return (
    <section className="border-t bg-white">
      <div className="px-4 sm:px-6 lg:px-20 py-8">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-5">Vistos recentemente</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-200">
          {items.map((product) => {
            const imageUrl = product.images?.[0] ? buildImageUrl(product.images[0]) : null
            const targetSlug = storeSlug || product.storeSlug

            return (
              <button
                key={product.id}
                onClick={() => router.push(`/loja/${targetSlug}/produto/${product.id}`)}
                className="flex-shrink-0 w-36 sm:w-44 group text-left"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="176px"
                    />
                  ) : (
                    <EmptyImageState className="rounded-xl" iconSize="sm" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
