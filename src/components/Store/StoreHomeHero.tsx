'use client'

import Image from 'next/image'
import { ArrowRight, ArrowUpRight, MapPin, Truck, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Product } from '@/types/product'
import type { StoreInfo } from '@/types/store'
import { heroContent, heroChips, freeShippingLabel, formatBRL, getStoreMonogram, getProductPrice } from '@/lib/storefront'
import { getProductImageUrl, getProductImageUrls } from '@/lib/imageUtils'
import { EmptyImageState } from '@/components/Product/EmptyImageState'

interface StoreHomeHeroProps {
  storeInfo: StoreInfo
  /** produto exibido no showcase (1º em destaque; fallback: mais recente) */
  showcase?: Product | null
  onOpenProduct: (product: Product) => void
  onExplore: () => void
  onNovidades: () => void
}

function chipIcon(chip: string, store: StoreInfo): LucideIcon {
  if (chip === freeShippingLabel(store)) return Truck
  if (chip.startsWith('Entrega')) return Clock
  return MapPin
}

export function StoreHomeHero({
  storeInfo,
  showcase,
  onOpenProduct,
  onExplore,
  onNovidades,
}: StoreHomeHeroProps) {
  const { eyebrow, title, subtitle } = heroContent(storeInfo)
  const chips = heroChips(storeInfo)
  const monogram = getStoreMonogram(storeInfo.name)

  const showcaseImages = showcase ? getProductImageUrls(showcase, 2) : []
  const frontImage = showcase ? getProductImageUrl(showcase) : null
  const backImage = showcaseImages.length > 1 ? showcaseImages[1] : null
  const hasPromo = !!(
    showcase?.promo_active &&
    showcase.discount_percentage &&
    showcase.discount_percentage > 0
  )

  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-6 md:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-nxp">
        {/* monograma decorativo + linha de grade */}
        <div className="pointer-events-none absolute -right-10 -top-16 select-none font-integral text-[260px] leading-none text-white/[0.05]">
          {monogram}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/[0.06] lg:block" />

        <div className="grid grid-cols-1 items-center gap-8 p-8 md:p-12 lg:grid-cols-2 lg:gap-6">
          {/* copy */}
          <div className="nx-fade">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {eyebrow}
            </span>
            <h1
              className="mt-3 font-extrabold leading-[0.95] tracking-[-0.035em] text-white"
              style={{ fontSize: 'clamp(40px, 5.5vw, 68px)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="break-words mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-white/70">
                {subtitle}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExplore}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold text-nxp transition-transform active:scale-95"
              >
                Explorar coleção <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={onNovidades}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10"
              >
                Ver novidades
              </button>
            </div>
            {chips.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2">
                {chips.map((chip) => {
                  const Icon = chipIcon(chip, storeInfo)
                  return (
                    <span
                      key={chip}
                      className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/60"
                    >
                      <Icon size={14} className="text-white/40" />
                      {chip}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* showcase do produto em destaque */}
          {showcase && (
            <div className="relative hidden nx-fade lg:block" style={{ animationDelay: '.08s' }}>
              <div className="relative ml-auto w-[78%]">
                {backImage && (
                  <div className="absolute -left-12 top-10 w-[60%] rotate-[-5deg] overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={backImage}
                        alt=""
                        fill
                        sizes="220px"
                        className="object-cover"
                        aria-hidden
                      />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onOpenProduct(showcase)}
                  className="group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-nxbg">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                      {frontImage ? (
                        <Image
                          src={frontImage}
                          alt={showcase.name}
                          fill
                          sizes="370px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <EmptyImageState iconSize="sm" className="rounded-none" />
                      )}
                    </div>
                    {hasPromo && (
                      <span className="absolute left-3 top-3 rounded-full bg-nxa px-2.5 py-1 text-[11px] font-bold text-white">
                        -{Math.round(showcase.discount_percentage!)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-nxi1">{showcase.name}</p>
                      {showcase.category?.name && (
                        <p className="text-[11px] text-nxi3">{showcase.category.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-extrabold text-nxi1">
                        {formatBRL(getProductPrice(showcase))}
                      </div>
                      {hasPromo && (
                        <div className="text-[11px] text-nxi3 line-through">
                          {formatBRL(parseFloat(showcase.price))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-nxp text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
