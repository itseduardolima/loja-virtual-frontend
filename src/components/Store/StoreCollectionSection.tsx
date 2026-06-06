'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronRight, LayoutGrid, List, SearchX, ArrowRight } from 'lucide-react'
import { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/imageUtils'
import { formatBRL, getProductPrice } from '@/lib/storefront'
import { Stars } from '@/components/Store/Product'
import { EmptyImageState } from '@/components/Product'
import { StoreHomeCard } from './StoreHomeCard'
import { StoreSectionHeader } from './StoreSectionHeader'
import type { CollectionSort, CollectionView } from '@/types/store'

export type { CollectionSort, CollectionView }

const SORT_OPTIONS: Array<[CollectionSort, string]> = [
  ['relevancia', 'Relevância'],
  ['menor', 'Menor preço'],
  ['maior', 'Maior preço'],
  ['avaliados', 'Mais avaliados'],
]

interface StoreCollectionSectionProps {
  products: Product[]
  loading: boolean
  activeCategory: string
  search: string
  sort: CollectionSort
  onSortChange: (sort: CollectionSort) => void
  view: CollectionView
  onViewChange: (view: CollectionView) => void
  onOpen: (product: Product) => void
  onQuickAdd: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  isWished: (productId: number) => boolean
  onClearFilters: () => void
  slug: string
}

function ListRow({
  product,
  index,
  onOpen,
}: {
  product: Product
  index: number
  onOpen: () => void
}) {
  const imageUrl = getProductImageUrl(product)
  const price = getProductPrice(product)
  const hasPromo = !!(product.promo_active && product.discount_percentage && product.discount_percentage > 0)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-nxbg',
        index > 0 && 'border-t border-nxborder',
      )}
    >
      <span className="hidden w-8 shrink-0 text-right font-mono text-[11px] text-nxi3 sm:block">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-nxbg">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill sizes="56px" className="object-cover" />
        ) : (
          <EmptyImageState iconSize="sm" className="rounded-none" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[14px] font-semibold text-nxi1">{product.name}</p>
        {product.category?.name && (
          <p className="mt-0.5 text-[11.5px] text-nxi3">{product.category.name}</p>
        )}
      </div>
      {(product.total_reviews ?? 0) > 0 && (
        <div className="mr-4 hidden items-center gap-1.5 sm:flex">
          <Stars rating={product.average_rating ?? 0} size={11} />
          <span className="text-[10px] text-nxi3">({product.total_reviews})</span>
        </div>
      )}
      <div className="mr-2 min-w-[80px] text-right">
        <div className="text-[14px] font-bold text-nxi1">{formatBRL(price)}</div>
        {hasPromo && (
          <div className="text-[11px] text-nxi3 line-through">
            {formatBRL(parseFloat(product.price))}
          </div>
        )}
      </div>
      <ChevronRight size={16} className="shrink-0 text-nxi3" />
    </button>
  )
}

export function StoreCollectionSection({
  products,
  loading,
  activeCategory,
  search,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpen,
  onQuickAdd,
  onToggleWishlist,
  isWished,
  onClearFilters,
  slug,
}: StoreCollectionSectionProps) {
  const isBento = activeCategory === 'Todos' && view === 'grid' && !search
  const title = search ? `Resultados para “${search}”` : activeCategory === 'Todos' ? 'Coleção' : activeCategory

  const cardFor = (product: Product, feat = false) => (
    <StoreHomeCard
      product={product}
      feat={feat}
      onOpen={() => onOpen(product)}
      onQuickAdd={() => onQuickAdd(product)}
      onToggleWishlist={() => onToggleWishlist(product)}
      wished={isWished(product.id)}
    />
  )

  return (
    <section id="colecao" className="mx-auto max-w-[1180px] scroll-mt-28 px-4 pb-4 pt-10 md:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <StoreSectionHeader
            eyebrow={activeCategory === 'Todos' ? 'Toda a loja' : activeCategory}
            title={title}
            size="lg"
          />
          <p className="mt-0.5 text-[12.5px] text-nxi3">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* ordenação */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as CollectionSort)}
              aria-label="Ordenar produtos"
              className="h-9 appearance-none rounded-full border border-nxborder bg-white pl-4 pr-9 text-[12.5px] font-semibold text-nxi2 focus:border-nxp focus:outline-none"
            >
              {SORT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-nxi3"
            />
          </div>
          {/* alternar visualização */}
          <div className="flex gap-0.5 rounded-full bg-nxbg p-0.5">
            {(
              [
                ['grid', LayoutGrid],
                ['list', List],
              ] as const
            ).map(([v, Icon]) => (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                aria-label={v === 'grid' ? 'Ver em grade' : 'Ver em lista'}
                aria-pressed={view === v}
                className={cn(
                  'flex h-8 w-9 items-center justify-center rounded-full transition-all',
                  view === v ? 'bg-white text-nxi1 shadow-sm' : 'text-nxi3',
                )}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-nxbg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-nxborder bg-nxbg/60 py-16 text-center">
          <SearchX size={28} className="text-nxi3" />
          <div>
            <p className="text-[15px] font-bold text-nxi1">Nenhum produto encontrado</p>
            <p className="mt-1 text-[12.5px] text-nxi3">
              Ajuste a busca ou os filtros para encontrar o que procura.
            </p>
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-1 rounded-full bg-nxp px-5 py-2.5 text-[12.5px] font-bold text-white transition-transform active:scale-95"
          >
            Limpar filtros
          </button>
        </div>
      ) : view === 'list' ? (
        <div className="overflow-hidden rounded-2xl border border-nxborder">
          {products.map((product, i) => (
            <ListRow key={product.id} product={product} index={i} onOpen={() => onOpen(product)} />
          ))}
        </div>
      ) : isBento ? (
        <div className="home-bento">
          {products.map((product, i) => (
            <div key={product.id} className={cn(i === 0 && 'feat')}>
              {cardFor(product, i === 0)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id}>{cardFor(product)}</div>
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/loja/${slug}/produtos`}
            className="inline-flex items-center gap-2 rounded-full border border-nxborder bg-white px-6 py-3 text-[13px] font-bold text-nxi1 transition-colors hover:border-nxp hover:text-nxp"
          >
            Ver todos os produtos <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  )
}
