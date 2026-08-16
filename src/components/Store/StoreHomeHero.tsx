'use client'

import Image from 'next/image'
import { ArrowRight, ArrowUpRight, MapPin, Truck, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Product } from '@/types/product'
import type { StoreInfo } from '@/types/store'
import { cn } from '@/lib/utils'
import { heroContent, heroChips, freeShippingLabel, formatBRL, getStoreMonogram, getProductPrice } from '@/lib/storefront'
import { getProductImageUrl, getProductImageUrls } from '@/lib/imageUtils'
import { EmptyImageState } from '@/components/Product'
import { StoreButton, StoreEyebrow, StoreBadge } from '@/components/Store/ui'

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

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 focus-visible:ring-offset-nxsurf'

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
    <section className="mx-auto max-w-store px-4 pt-6 md:px-10">
      <div className="relative overflow-hidden">
        {/* monograma marca-d'água */}
        <div className="pointer-events-none absolute -right-6 -top-14 select-none font-integral text-[200px] leading-none text-store/[0.05] sm:-top-20 sm:text-[300px]">
          {monogram}
        </div>

        <div
          className={cn(
            'relative grid grid-cols-1 items-center gap-8 py-6 md:py-10 lg:gap-12',
            showcase && 'md:grid-cols-2',
          )}
        >
          {/* copy */}
          <div className="nx-fade">
            <StoreEyebrow tone="accent">{eyebrow}</StoreEyebrow>
            <h1 className="mt-4 break-words font-integral text-[clamp(40px,5.5vw,66px)] leading-[1] tracking-[-0.03em] text-nxi1">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-[46ch] break-words text-[15px] leading-[1.6] text-nxi2 sm:text-[17px]">
                {subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <StoreButton variant="primary" size="lg" onClick={onExplore}>
                Explorar coleção <ArrowRight size={18} strokeWidth={2.2} />
              </StoreButton>
              <StoreButton variant="outline" size="lg" onClick={onNovidades}>
                Ver novidades
              </StoreButton>
            </div>

            {chips.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                {chips.map((chip) => {
                  const Icon = chipIcon(chip, storeInfo)
                  return (
                    <span
                      key={chip}
                      className="flex items-center gap-2.5 text-[13px] font-semibold text-nxi2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-store/[0.08] text-store">
                        <Icon size={16} />
                      </span>
                      {chip}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* showcase do produto em destaque */}
          {showcase && (
            <div className="nx-fade relative hidden md:block">
              <div className="relative mx-auto w-full max-w-[360px]">
                {/* card fantasma rotacionado atrás */}
                <div
                  aria-hidden
                  className="absolute right-2 top-6 h-[82%] w-[70%] rotate-[6deg] overflow-hidden rounded-[22px] border border-nxborder bg-nxbg shadow-[0_30px_60px_-30px_rgba(7,8,21,0.4)]"
                >
                  {backImage && (
                    <Image
                      src={backImage}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover opacity-90"
                      aria-hidden
                    />
                  )}
                </div>

                {/* card em destaque */}
                <button
                  type="button"
                  onClick={() => onOpenProduct(showcase)}
                  aria-label={`Ver ${showcase.name}`}
                  className={cn(
                    'group relative z-10 block w-full overflow-hidden rounded-[24px] border border-nxborder bg-white p-4 text-left shadow-[0_40px_80px_-34px_rgba(7,8,21,0.5)] transition-transform duration-500 hover:-translate-y-1 active:scale-[0.99]',
                    focusRing,
                  )}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-nxbg">
                    <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
                      {frontImage ? (
                        <Image
                          src={frontImage}
                          alt={showcase.name}
                          fill
                          sizes="360px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <EmptyImageState iconSize="sm" className="rounded-none" />
                      )}
                    </div>
                    <StoreBadge tone="new" className="absolute left-3 top-3 z-10">
                      Mais vendido
                    </StoreBadge>
                  </div>

                  <div className="px-1.5 pb-1 pt-4">
                    {showcase.category?.name && (
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
                        {showcase.category.name}
                      </span>
                    )}
                    <p className="mt-1.5 line-clamp-2 font-bold leading-[1.25] tracking-[-0.01em] text-nxi1">
                      {showcase.name}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-[20px] font-extrabold text-nxi1">
                        {formatBRL(getProductPrice(showcase))}
                      </span>
                      {hasPromo && (
                        <span className="text-[13px] text-nxi3 line-through">
                          {formatBRL(parseFloat(showcase.price))}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-store text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
