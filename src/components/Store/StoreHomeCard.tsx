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

interface StoreHomeCardProps {
  product: Product
  /** card grande do bento (aspect 1/1, tipografia maior) */
  feat?: boolean
  /** eyebrow de categoria (mono uppercase) — usado na PLP; sem ele o card da home fica idêntico */
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

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-nxborder bg-white transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(3,7,18,0.10)]"
    >
      <div
        className={cn('relative overflow-hidden bg-nxbg', feat ? 'aspect-square' : 'aspect-[3/4]')}
      >
        <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes={feat ? '(max-width: 768px) 100vw, 600px' : '(max-width: 768px) 50vw, 300px'}
              className="object-cover"
            />
          ) : (
            <EmptyImageState iconSize="sm" className="rounded-none" />
          )}
        </div>

        {hasPromo ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-nxa px-2 py-0.5 text-[10px] font-bold text-white">
            -{Math.round(product.discount_percentage!)}%
          </span>
        ) : isNew ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-nxi1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
            Novo
          </span>
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist()
          }}
          aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={wished}
          className={cn(
            'absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors',
            wished ? 'text-nxd' : 'text-nxi2 hover:text-nxd',
          )}
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* quick add — desliza de baixo no hover */}
        {!soldOut && (
          <div className="absolute inset-x-2.5 bottom-2.5 translate-y-[130%] transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (hasVariations) onOpen()
                else onQuickAdd()
              }}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-nxp text-[12px] font-bold text-white shadow-lg transition-transform active:scale-95"
            >
              {hasVariations ? (
                <>
                  Ver opções <ArrowRight size={14} />
                </>
              ) : (
                <>
                  <Plus size={14} /> Adicionar
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        {eyebrow && (
          <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-nxi3">
            {eyebrow}
          </span>
        )}
        <p
          className={cn(
            'line-clamp-1 font-semibold tracking-[-0.01em] text-nxi1',
            eyebrow && 'mt-0.5',
            feat
              ? 'text-[15px]'
              : eyebrow
                ? dense
                  ? 'text-[12.5px]'
                  : 'text-[13.5px]'
                : 'text-[13px]',
          )}
        >
          {product.name}
        </p>
        {(product.total_reviews ?? 0) > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            <Stars rating={product.average_rating ?? 0} size={11} />
            <span className="text-[10px] text-nxi3">({product.total_reviews})</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                'font-extrabold text-nxi1',
                feat
                  ? 'text-[16px]'
                  : eyebrow
                    ? dense
                      ? 'text-[13.5px]'
                      : 'text-[15px]'
                    : 'text-[13.5px]',
              )}
            >
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
                  className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10"
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
