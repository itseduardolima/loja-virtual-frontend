'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { StoreEditorialCard, getProductImageUrl } from '@/components/Store/StoreEditorialCard'
import { IconGrid, IconList, IconHeart } from '@/assets/icons'
import { Product } from '@/types/product'

interface StoreProductGridProps {
  products: Product[]
  loading: boolean
  categoryKey: string
  search: string
  novidadesActive?: boolean
  onClearSearch: () => void
  slug: string
  viewMode: 'editorial' | 'list'
  setViewMode: (mode: 'editorial' | 'list') => void
}

const BENTO_LAYOUT = [
  { col: '1/3', row: '1/3' },
  { col: '3',   row: '1'   },
  { col: '3',   row: '2'   },
  { col: '1',   row: '3'   },
  { col: '2',   row: '3'   },
  { col: '3',   row: '3'   },
  { col: '1',   row: '4'   },
  { col: '2/4', row: '4'   },
]

function ProductListRow({ product, index, slug }: { product: Product; index: number; slug: string }) {
  const router = useRouter()
  const imageUrl = getProductImageUrl(product)
  const price = product.final_price ?? parseFloat(product.price)
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  const originalPrice =
    product.promo_active && product.promo_price
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(product.price))
      : null
  const rating = product.average_rating ?? 0
  const totalReviews = product.total_reviews ?? 0

  return (
    <motion.div
      className="store-list-row"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => router.push(`/loja/${slug}/produto/${product.id}`)}
    >
      <div className="px-0 py-[13px] flex items-center">
        <span className="hidden sm:block w-10 flex-shrink-0 font-mono text-[11px] text-gray-300 tracking-[.1em] text-right pr-4">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-[44px] h-[54px] sm:w-[52px] sm:h-[62px] rounded-[6px] overflow-hidden flex-shrink-0 relative bg-[#e8e0d8]">
          {imageUrl && (
            <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="52px" />
          )}
        </div>
        <div className="flex-1 px-3 sm:px-4 min-w-0">
          <p className="text-[13px] sm:text-[15px] font-semibold text-[#111827] tracking-[-0.01em] line-clamp-1">{product.name}</p>
          <p className="text-[11px] text-gray-400 mt-[2px] line-clamp-1">{product.category?.name ?? ''}</p>
        </div>
        <div className="hidden sm:flex items-center gap-[2px] flex-shrink-0 mr-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={[
                'w-[11px] h-[11px]',
                i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200',
              ].join(' ')}
            />
          ))}
          {totalReviews > 0 && (
            <span className="text-[11px] text-gray-400 ml-1">({totalReviews})</span>
          )}
        </div>
        <div className="flex-shrink-0 mr-2 sm:mr-5 text-right min-w-[70px] sm:min-w-[80px]">
          <p className="text-[13px] sm:text-[15px] font-bold text-[#111827]">{formattedPrice}</p>
          {originalPrice && (
            <p className="text-[11px] text-gray-400 line-through mt-[1px]">{originalPrice}</p>
          )}
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <IconHeart size={16} className="text-[#9CA3AF]" />
        </div>
      </div>
    </motion.div>
  )
}

export function StoreProductGrid({
  products,
  loading,
  categoryKey,
  search,
  novidadesActive,
  onClearSearch,
  slug,
  viewMode,
  setViewMode,
}: StoreProductGridProps) {
  const router = useRouter()
  const title = search ? `"${search}"` : novidadesActive ? 'Novidades' : 'Coleção'
  const subtitle = loading
    ? ''
    : `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`

  const isBento = viewMode === 'editorial' && categoryKey === 'Todos' && !search && !novidadesActive

  return (
    <div className="px-4 md:px-20 pt-8 md:pt-10 pb-[60px]">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111] tracking-[-0.02em]">{title}</h2>
          {!loading && (
            <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-[3px] bg-gray-100 rounded-[9px] p-[3px]">
          <button
            onClick={() => setViewMode('editorial')}
            className={[
              'w-[34px] h-[29px] rounded-[7px] border-0 cursor-pointer flex items-center justify-center transition-all',
              viewMode === 'editorial' ? 'bg-white shadow-sm' : 'bg-transparent',
            ].join(' ')}
            aria-label="Grade editorial"
          >
            <IconGrid active={viewMode === 'editorial'} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={[
              'w-[34px] h-[29px] rounded-[7px] border-0 cursor-pointer flex items-center justify-center transition-all',
              viewMode === 'list' ? 'bg-white shadow-sm' : 'bg-transparent',
            ].join(' ')}
            aria-label="Lista"
          >
            <IconList active={viewMode === 'list'} />
          </button>
        </div>
      </div>

      {loading ? (
        isBento ? (
          <div className="ed-bento">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[8px] animate-pulse bg-[#ede8e3]"
                style={{
                  gridColumn: BENTO_LAYOUT[i]?.col ?? 'auto',
                  gridRow: BENTO_LAYOUT[i]?.row ?? 'auto',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[6px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-[8px] animate-pulse bg-[#ede8e3]" />
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        search ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[17px] font-semibold text-[#111] tracking-[-0.01em]">
              Nenhum resultado para &ldquo;{search}&rdquo;
            </p>
            <p className="text-[13px] text-gray-400 mt-1.5">
              Tente outro termo ou navegue pelas categorias.
            </p>
            <button
              onClick={onClearSearch}
              className="mt-7 px-6 py-2.5 rounded-full border border-gray-300 text-[13px] font-medium text-[#111] hover:border-gray-500 transition-colors bg-white"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[17px] font-semibold text-[#111] tracking-[-0.01em]">Em breve, novidades</p>
            <p className="text-[13px] text-gray-400 mt-1.5 max-w-xs">
              Esta loja está preparando seus produtos. Volte em breve para conferir!
            </p>
          </div>
        )
      ) : viewMode === 'list' ? (
        <div>
          {products.map((product, index) => (
            <ProductListRow key={product.id} product={product} index={index} slug={slug} />
          ))}
        </div>
      ) : isBento ? (
        <div className="ed-bento">
          {products.slice(0, 8).map((p, i) => (
            <motion.div
              key={p.id}
              className="relative overflow-hidden rounded-[8px] flex flex-col"
              style={{
                gridColumn: BENTO_LAYOUT[i]?.col ?? 'auto',
                gridRow: BENTO_LAYOUT[i]?.row ?? 'auto',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
            >
              <StoreEditorialCard
                product={p}
                index={i}
                onViewDetails={() => router.push(`/loja/${slug}/produto/${p.id}`)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[6px]">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              className="relative aspect-[3/4] overflow-hidden rounded-[8px] flex flex-col"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <StoreEditorialCard
                product={p}
                index={i}
                onViewDetails={() => router.push(`/loja/${slug}/produto/${p.id}`)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
