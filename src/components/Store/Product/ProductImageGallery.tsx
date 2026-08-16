'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyImageState } from '@/components/Product'

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
  const [index, setIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const urls = buildImageUrls(images)

  // troca de cor pode reduzir a lista — mantém o índice válido
  const safeIndex = Math.min(index, Math.max(urls.length - 1, 0))

  if (urls.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-nxborder">
        <EmptyImageState iconSize="md" />
      </div>
    )
  }

  const prev = () => setIndex((safeIndex - 1 + urls.length) % urls.length)
  const next = () => setIndex((safeIndex + 1) % urls.length)

  const openLightbox = (at: number) => {
    setIndex(at)
    setLightboxOpen(true)
  }

  return (
    <div>
      {/* mobile: imagem única ou swipe com dots — toque amplia */}
      <div className="lg:hidden">
        {urls.length === 1 ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            aria-label="Ampliar imagem do produto"
            className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-nxborder bg-nxsurf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
          >
            <DiscountBadge value={discountPercentage} />
            <Image
              src={urls[0]}
              alt={productName}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </button>
        ) : (
          <>
            <div
              className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden"
              onScroll={(e) => {
                const el = e.currentTarget
                setMobileIndex(Math.round(el.scrollLeft / (el.clientWidth * 0.88 + 8)))
              }}
            >
              {urls.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openLightbox(i)}
                  aria-label={`Ampliar imagem ${i + 1}`}
                  className="relative aspect-[4/5] w-[88%] shrink-0 cursor-zoom-in snap-center overflow-hidden rounded-2xl border border-nxborder bg-nxsurf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
                >
                  {i === 0 && <DiscountBadge value={discountPercentage} />}
                  <Image
                    src={url}
                    alt={`${productName} ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="88vw"
                    priority={i === 0}
                  />
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-1.5">
              {urls.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === mobileIndex ? 'w-5 bg-store' : 'w-1.5 bg-nxborder',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* desktop: rail de miniaturas + stage único (nunca corta o produto) */}
      <div
        key={galleryKey}
        className="nx-gallery-swap hidden lg:sticky lg:top-24 lg:grid lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-3.5 lg:self-start"
      >
        <div className="flex flex-col gap-2.5" role="tablist" aria-label="Imagens do produto">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagem ${i + 1}`}
              aria-current={i === safeIndex}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-xl border-[1.5px] bg-nxsurf transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
                i === safeIndex ? 'border-store' : 'border-nxborder hover:border-nxi3',
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-contain"
                sizes="72px"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagem do produto"
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-nxborder bg-nxsurf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
        >
          {safeIndex === 0 && <DiscountBadge value={discountPercentage} />}
          <Image
            src={urls[safeIndex]}
            alt={`${productName} ${safeIndex + 1}`}
            fill
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <span className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full border border-nxborder bg-white/85 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-nxi3 backdrop-blur-sm">
            <ZoomIn size={11} /> Ampliar
          </span>
        </button>
      </div>

      {/* lightbox — contrato de modal via Radix (focus trap, Esc, scroll lock) */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[250] bg-coal/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-[251] flex items-center justify-center p-4 focus:outline-none sm:p-10"
            onKeyDown={(e) => {
              if (urls.length < 2) return
              if (e.key === 'ArrowLeft') prev()
              if (e.key === 'ArrowRight') next()
            }}
          >
            <Dialog.Title className="sr-only">{productName} — imagem ampliada</Dialog.Title>
            <div className="relative aspect-[4/5] max-h-full w-full max-w-[560px] overflow-hidden rounded-2xl bg-nxsurf">
              <Image
                src={urls[safeIndex]}
                alt={`${productName} ${safeIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            <Dialog.Close
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} />
            </Dialog.Close>

            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Imagem anterior"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próxima imagem"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
                >
                  <ChevronRight size={22} />
                </button>
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                  {urls.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        i === safeIndex ? 'w-5 bg-white' : 'w-2 bg-white/35',
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
