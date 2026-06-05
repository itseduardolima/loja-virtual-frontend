'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { StoreInfo } from '@/types/store'
import { buildImageUrl } from '@/lib/imageUtils'
import { getStoreMonogram } from '@/lib/storefront'

interface StoreFeatureBannerProps {
  storeInfo: StoreInfo
  onExplore: () => void
}

/** Campanha configurada pelo vendedor em Configurações → Vitrine. Oculta sem título. */
export function StoreFeatureBanner({ storeInfo, onExplore }: StoreFeatureBannerProps) {
  const title = storeInfo.campaign_title?.trim()
  if (!title) return null

  const text = storeInfo.campaign_text?.trim()
  const banner = storeInfo.banner ? buildImageUrl(storeInfo.banner) : null
  const monogram = getStoreMonogram(storeInfo.name)

  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-14 md:px-10">
      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-nxborder md:grid-cols-2">
        <div className="flex flex-col justify-center gap-3 bg-nxbg p-8 md:p-12">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-nxp">
            Campanha
          </span>
          <h3 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.025em] text-nxi1 sm:text-[34px]">
            {title}
          </h3>
          {text && (
            <p className="max-w-[40ch] text-[13.5px] leading-relaxed text-nxi2">{text}</p>
          )}
          <button
            type="button"
            onClick={onExplore}
            className="mt-2 inline-flex w-max items-center gap-2 rounded-full bg-nxp px-5 py-3 text-[13px] font-bold text-white transition-transform active:scale-95"
          >
            Explorar coleção <ArrowRight size={16} />
          </button>
        </div>
        <div className="relative min-h-[260px] bg-nxp">
          {banner && (
            <div className="absolute inset-0">
              <Image
                src={banner}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 590px"
                className="object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-nxp/35" />
          <div className="pointer-events-none absolute -right-6 -top-10 select-none font-integral text-[180px] leading-none text-white/[0.12]">
            {monogram}
          </div>
        </div>
      </div>
    </section>
  )
}
