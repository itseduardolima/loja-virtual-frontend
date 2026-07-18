'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import { IconStar } from '@/assets/icons'
import { Product } from '@/types/product'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { StoreEyebrow } from '@/components/Store/ui'

function getProductImage(product: Product): string | null {
  const imgs = product.images as unknown
  if (imgs && typeof imgs === 'object' && !Array.isArray(imgs)) {
    const first = Object.values(imgs as Record<string, string[]>)[0]
    if (first?.length) return first[0]
  }
  if (Array.isArray(imgs) && imgs.length) return imgs[0]
  return null
}

const CHIP_CLASS =
  'rounded-full bg-nxbg px-3 py-[6px] text-[12px] font-medium text-nxi2 transition-colors duration-[120ms] hover:bg-nxsurf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2'

export interface StoreSearchDropdownProps {
  query: string
  visible: boolean
  suggestions: Product[]
  loading: boolean
  categories: string[]
  onClose: () => void
  onSelect: (q: string) => void
  onClickProduct: (p: Product) => void
}

export function StoreSearchDropdown({
  query,
  visible,
  suggestions,
  loading,
  categories,
  onClose,
  onSelect,
  onClickProduct,
}: StoreSearchDropdownProps) {
  const q = query.trim()
  const hasQ = q.length > 0

  const filteredCats = categories.filter(c => c !== 'Todos')

  return (
    <div
      className={[
        'absolute top-[calc(100%+10px)] left-1/2 w-[580px]',
        'bg-white rounded-[20px] border border-nxborder overflow-hidden z-[500]',
        'shadow-[0_20px_64px_-24px_rgba(7,8,21,0.35)]',
        'origin-top transition-[opacity,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)]',
        visible
          ? 'opacity-100 translate-x-[-50%] translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-x-[-50%] translate-y-[-10px] scale-[.96] pointer-events-none',
      ].join(' ')}
    >
      {!hasQ ? (
        <div className="px-5 pt-[18px] pb-5">
          {filteredCats.length > 0 ? (
            <>
              <StoreEyebrow tone="muted" className="mb-[10px]">
                Categorias
              </StoreEyebrow>
              <div className="flex flex-wrap gap-[6px]">
                {filteredCats.map(cat => (
                  <button key={cat} onClick={() => onSelect(cat)} className={CHIP_CLASS}>
                    {cat}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="py-2 text-[13px] text-nxi3">
              Digite para buscar produtos na loja.
            </p>
          )}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-[10px] px-8 py-8">
          <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-nxborder border-t-store" />
          <span className="text-[13px] text-nxi3">Buscando...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div>
          <div className="flex items-center justify-between border-b border-nxborder px-5 pb-[10px] pt-[14px]">
            <span className="text-[12px] text-nxi3">
              <b className="text-nxi1">{suggestions.length}</b>{' '}
              resultado{suggestions.length > 1 ? 's' : ''} para{' '}
              <b className="italic text-nxi1">&ldquo;{q}&rdquo;</b>
            </span>
            <button
              onClick={onClose}
              className="rounded-lg text-[12px] font-semibold text-store transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
            >
              Ver todos →
            </button>
          </div>
          {suggestions.slice(0, 5).map((p, i) => {
            const imgSrc = getProductImage(p)
            const price = p.final_price ?? parseFloat(p.price)
            return (
              <button
                key={p.id}
                onClick={() => onClickProduct(p)}
                className={[
                  'flex w-full items-center gap-[14px] px-5 py-3 text-left',
                  'transition-colors duration-[120ms] hover:bg-nxsurf',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-store',
                  i < Math.min(suggestions.length, 5) - 1 ? 'border-b border-nxborder' : '',
                ].join(' ')}
              >
                <div className="relative h-16 w-[52px] flex-shrink-0 overflow-hidden rounded-[10px] bg-nxbg">
                  {imgSrc && (
                    <Image
                      src={buildImageUrl(imgSrc)}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="52px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold tracking-[-0.01em] text-nxi1">
                    {p.name}
                  </p>
                  <div className="mt-[5px] flex items-center gap-[6px]">
                    {p.category && (
                      <span className="rounded-full bg-nxbg px-2 py-[2px] text-[10px] font-semibold text-nxi3">
                        {p.category.name}
                      </span>
                    )}
                    {p.average_rating != null && (
                      <div className="flex gap-[2px]">
                        {[1, 2, 3, 4, 5].map(j => (
                          <IconStar key={j} size={10} filled={j <= Math.round(p.average_rating ?? 0)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[15px] font-bold tracking-[-0.02em] text-nxi1">
                    {formatPrice(price)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-nxbg text-nxi3">
            <Search size={18} strokeWidth={2} />
          </div>
          <p className="text-[15px] font-bold text-nxi1">
            Sem resultados para <span className="italic">&ldquo;{q}&rdquo;</span>
          </p>
          <p className="mt-[6px] text-[12.5px] leading-[1.5] text-nxi3">
            Tente um termo diferente ou explore nossas categorias.
          </p>
          {filteredCats.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-[6px]">
              {filteredCats.map(cat => (
                <button key={cat} onClick={() => onSelect(cat)} className={CHIP_CLASS}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
