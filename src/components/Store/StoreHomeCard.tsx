'use client'

import Image from 'next/image'
import { Heart, Plus, ArrowRight } from 'lucide-react'
import { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/imageUtils'
import { isNewProduct, formatBRL, getProductPrice } from '@/lib/storefront'
import { getColorHex } from '@/schemas'
import { Stars } from '@/components/Store/Product'
import { EmptyImageState } from '@/components/Product'
import { StoreBadge, storeCardClass } from '@/components/Store/ui'

interface StoreHomeCardProps {
  product: Product
  /** card grande do bento (aspect quadrado, legenda sobre scrim) */
  feat?: boolean
  /** eyebrow de categoria (mono uppercase) — usado na PLP/rows */
  eyebrow?: string
  /** variante compacta da PLP (grid denso) */
  dense?: boolean
  onOpen: () => void
  onQuickAdd: () => void
  onToggleWishlist: () => void
  wished: boolean
}

/** Produto tem variação (cor/tamanho) que exige escolha antes de comprar? */
export function productHasVariations(product: Product): boolean {
  if (product.variant_stocks && product.variant_stocks.length > 0) return true
  if (product.images_by_color && Object.keys(product.images_by_color).length > 1) return true
  return false
}

export function productColors(product: Product): string[] {
  if (product.colors && product.colors.length > 0) return product.colors
  if (product.images_by_color) return Object.keys(product.images_by_color)
  return []
}

export function StoreHomeCard({
  product,
  feat,
  eyebrow,
  dense,
  onOpen,
  onQuickAdd,
  onToggleWishlist,
  wished,
}: StoreHomeCardProps) {
  const imageUrl = getProductImageUrl(product)
  const price = getProductPrice(product)
  const hasPromo = !!(
    product.promo_active &&
    product.discount_percentage &&
    product.discount_percentage > 0
  )
  const isNew = isNewProduct(product.created_at)
  const colors = productColors(product)
  const hasVariations = productHasVariations(product)
  const soldOut = product.stock <= 0
  const hasReviews = (product.total_reviews ?? 0) > 0

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 focus-visible:ring-offset-nxbg'

  const badge = hasPromo ? (
    <StoreBadge tone="promo">-{Math.round(product.discount_percentage!)}%</StoreBadge>
  ) : isNew ? (
    <StoreBadge tone="new">Novo</StoreBadge>
  ) : null

  const wishlistButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggleWishlist()
      }}
      aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={wished}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors',
        focusRing,
        wished ? 'text-nxd' : 'text-nxi2 hover:text-nxd',
      )}
    >
      <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
    </button>
  )

  const quickAdd = !soldOut && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (hasVariations) onOpen()
        else onQuickAdd()
      }}
      className={cn(
        'flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-store text-[13px] font-bold text-white shadow-lg transition-transform active:scale-[0.97]',
        focusRing,
      )}
    >
      {hasVariations ? (
        <>
          Ver opções <ArrowRight size={15} />
        </>
      ) : (
        <>
          <Plus size={15} /> Adicionar
        </>
      )}
    </button>
  )

  // ── Card em destaque (bento 2×2): imagem cheia + legenda sobre scrim ──
  if (feat) {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        className={cn(
          'group relative flex h-full min-h-[300px] cursor-pointer overflow-hidden rounded-[20px] border border-nxborder bg-nxbg',
          focusRing,
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          ) : (
            <EmptyImageState iconSize="sm" className="rounded-none" />
          )}
        </div>

        {badge && <span className="absolute left-4 top-4 z-10">{badge}</span>}
        <span className="absolute right-4 top-4 z-10">{wishlistButton}</span>

        <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-coal/85 via-coal/25 to-transparent p-6 pt-16 text-white">
          <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
            {eyebrow ?? product.category?.name ?? 'Destaque'}
          </span>
          <h3 className="mt-2 font-integral text-[22px] leading-[1.05] tracking-[-0.02em] sm:text-[26px]">
            {product.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="text-[20px] font-extrabold">{formatBRL(price)}</span>
            {hasPromo && (
              <span className="text-[13px] text-white/60 line-through">
                {formatBRL(parseFloat(product.price))}
              </span>
            )}
            {hasReviews && (
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/80">
                <Stars rating={product.average_rating ?? 0} size={13} />({product.total_reviews})
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Card padrão ──
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className={cn(
        'group flex h-full cursor-pointer flex-col',
        storeCardClass({ interactive: true }),
        focusRing,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-nxbg">
        <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover"
            />
          ) : (
            <EmptyImageState iconSize="sm" className="rounded-none" />
          )}
        </div>

        {badge && <span className="absolute left-3 top-3">{badge}</span>}
        <span className="absolute right-3 top-3">{wishlistButton}</span>

        {/* quick add — desliza de baixo no hover/foco */}
        {!soldOut && (
          <div className="absolute inset-x-3 bottom-3 translate-y-[130%] transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
            {quickAdd}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        {eyebrow && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-nxi3">
            {eyebrow}
          </span>
        )}
        <p
          className={cn(
            'line-clamp-1 font-bold tracking-[-0.01em] text-nxi1',
            eyebrow && 'mt-1',
            dense ? 'text-[13px]' : 'text-[14px]',
          )}
        >
          {product.name}
        </p>
        {hasReviews && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.average_rating ?? 0} size={11} />
            <span className="text-[10px] text-nxi3">({product.total_reviews})</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className={cn('font-extrabold text-nxi1', dense ? 'text-[14px]' : 'text-[16px]')}>
              {formatBRL(price)}
            </span>
            {hasPromo && (
              <span className="text-[11px] text-nxi3 line-through">
                {formatBRL(parseFloat(product.price))}
              </span>
            )}
          </div>
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-black/10"
                  style={{ background: getColorHex(c) }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-[10px] font-semibold text-nxi3">+{colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
