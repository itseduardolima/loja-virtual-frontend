'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { StoreInfo } from '@/types/store'
import { buildImageUrl } from '@/lib/imageUtils'
import { getStoreMonogram } from '@/lib/storefront'
import { StoreButton, StoreEyebrow } from '@/components/Store/ui'

interface StoreFeatureBannerProps {
  storeInfo: StoreInfo
  onExplore: () => void
}

/** Campanha configurada pelo vendedor em Configurações → Vitrine. Oculta sem título. */
export function StoreFeatureBanner({ storeInfo, onExplore }: StoreFeatureBannerProps) {
  const title = storeInfo.campaign_title?.trim()
  if (!title) return null

  const text = storeInfo.campaign_text?.trim()
  const rawImg = storeInfo.campaign_image || storeInfo.banner
  const banner = rawImg
    ? rawImg.startsWith('blob:') || rawImg.startsWith('http') || rawImg.startsWith('data:')
      ? rawImg
      : buildImageUrl(rawImg)
    : null
  const monogram = getStoreMonogram(storeInfo.name)

  return (
    <section className="mx-auto max-w-store px-4 pt-14 md:px-10">
      <div className="grid grid-cols-1 overflow-hidden rounded-[24px] bg-coal md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          <StoreEyebrow tone="onDark">Campanha</StoreEyebrow>
          <h2 className="font-integral text-[28px] leading-[1.02] tracking-[-0.03em] text-white sm:text-[40px]">
            {title}
          </h2>
          {text && (
            <p className="max-w-[42ch] text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
              {text}
            </p>
          )}
          <StoreButton variant="primary" size="lg" onClick={onExplore} className="mt-2 w-max">
            Explorar coleção <ArrowRight size={16} />
          </StoreButton>
        </div>
        <div className="relative min-h-[300px] md:min-h-[340px]">
          {banner ? (
            <Image
              src={banner}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 590px"
              className="object-cover"
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden">
              <span className="font-integral text-[200px] leading-none text-white/[0.06]">
                {monogram}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
