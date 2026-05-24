'use client'

import Image from 'next/image'
import { IconSearch, IconStar } from '@/assets/icons'
import { Product } from '@/types/product'
import { formatPrice, buildImageUrl } from '@/lib/utils'

function getProductImage(product: Product): string | null {
  const imgs = product.images as unknown
  if (imgs && typeof imgs === 'object' && !Array.isArray(imgs)) {
    const first = Object.values(imgs as Record<string, string[]>)[0]
    if (first?.length) return first[0]
  }
  if (Array.isArray(imgs) && imgs.length) return imgs[0]
  return null
}

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
        'bg-white rounded-[20px] border border-[#F0EBE3] overflow-hidden z-[500]',
        'shadow-[0_20px_64px_rgba(0,0,0,.16),0_2px_8px_rgba(0,0,0,.06)]',
        'origin-top transition-[opacity,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)]',
        visible
          ? 'opacity-100 translate-x-[-50%] translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-x-[-50%] translate-y-[-10px] scale-[.96] pointer-events-none',
      ].join(' ')}
    >
      {!hasQ ? (
        <div className="px-5 pt-[18px] pb-5">
          {filteredCats.length > 0 && (
            <>
              <p className="font-mono text-[8.5px] tracking-[.18em] uppercase text-[#B0A89E] mb-[10px]">
                Categorias
              </p>
              <div className="flex flex-wrap gap-[6px] mb-4">
                {filteredCats.map(cat => (
                  <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className="bg-[#F7F3EF] border-0 rounded-full px-3 py-[5px] text-[12px] font-medium text-[#5A3C1E] cursor-pointer transition-colors duration-[120ms] hover:bg-[#EDE5DB]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="font-mono text-[8.5px] tracking-[.18em] uppercase text-[#B0A89E] mb-2">
            Sugestões
          </p>
          {['vestido midi', 'blusa de linho', 'calça wide leg', 'acessórios', 'novidades'].map((term, i) => (
            <button
              key={i}
              onClick={() => onSelect(term)}
              className="w-full flex items-center gap-[10px] px-[2px] py-2 bg-transparent border-0 cursor-pointer text-left rounded-lg transition-colors duration-[120ms] hover:bg-[#FAF6F2]"
            >
              <span className="flex-shrink-0 opacity-50">
                <IconSearch size={13} />
              </span>
              <span className="text-[13px] text-[#374151]">{term}</span>
            </button>
          ))}
        </div>
      ) : loading ? (
        <div className="px-8 py-8 flex items-center justify-center gap-[10px]">
          <div className="w-[18px] h-[18px] border-2 border-[#E5E7EB] border-t-[#5A3C1E] rounded-full animate-spin" />
          <span className="text-[13px] text-[#9CA3AF]">Buscando...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div>
          <div className="flex items-center justify-between px-5 pt-[14px] pb-[10px] border-b border-[#F5F0EB]">
            <span className="text-[12px] text-[#9CA3AF]">
              <b className="text-[#111]">{suggestions.length}</b>{' '}
              resultado{suggestions.length > 1 ? 's' : ''} para{' '}
              <b className="text-[#111] italic">&ldquo;{q}&rdquo;</b>
            </span>
            <button
              onClick={onClose}
              className="text-[12px] text-[#5A3C1E] font-semibold bg-transparent border-0 cursor-pointer"
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
                  'w-full flex items-center gap-[14px] px-5 py-3',
                  'bg-transparent border-0 cursor-pointer text-left',
                  'transition-colors duration-[120ms] hover:bg-[#FAF6F2]',
                  i < Math.min(suggestions.length, 5) - 1 ? 'border-b border-[#FAF7F4]' : '',
                ].join(' ')}
              >
                <div className="w-[52px] h-16 rounded-[10px] overflow-hidden flex-shrink-0 bg-[#f0ebe5] relative">
                  {imgSrc ? (
                    <Image src={buildImageUrl(imgSrc)} alt={p.name} fill className="object-cover" sizes="52px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f5ede3] to-[#d4c4b4]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-[#111] tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-[6px] mt-[5px]">
                    {p.category && (
                      <span className="text-[10px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-[2px] rounded-full">
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
                <div className="text-right flex-shrink-0">
                  <p className="text-[15px] font-extrabold text-[#111] tracking-[-0.02em]">
                    {formatPrice(price)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="px-8 py-10 text-center">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[#FAF6F2] flex items-center justify-center mx-auto mb-4">
            <IconSearch size={13} />
          </div>
          <p className="text-[15px] font-bold text-[#111]">
            Sem resultados para <span className="italic">&ldquo;{q}&rdquo;</span>
          </p>
          <p className="text-[12.5px] text-[#9CA3AF] mt-[6px] leading-[1.5]">
            Tente um termo diferente ou explore nossas categorias.
          </p>
          {filteredCats.length > 0 && (
            <div className="flex justify-center flex-wrap gap-[6px] mt-4">
              {filteredCats.map(cat => (
                <button
                  key={cat}
                  onClick={() => onSelect(cat)}
                  className="bg-[#F7F3EF] border-0 rounded-full px-[14px] py-[6px] text-[12px] font-medium text-[#5A3C1E] cursor-pointer transition-colors duration-[120ms] hover:bg-[#EDE5DB]"
                >
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
