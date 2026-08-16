'use client'

import { Plus, Minus, ShoppingBag, Ban, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface ProductMobileBuyBarProps {
  finalPrice: number | string
  originalPrice: string
  hasDiscount: boolean
  currentStock: number
  hasColors: boolean
  hasSizes: boolean
  selectedColor: string | null
  selectedSize: string | null
  quantity: number
  isAddingToCart: boolean
  onIncrease: () => void
  onDecrease: () => void
  onAddToCart: () => void
}

export function ProductMobileBuyBar({
  finalPrice,
  originalPrice,
  hasDiscount,
  currentStock,
  hasColors,
  hasSizes,
  selectedColor,
  selectedSize,
  quantity,
  isAddingToCart,
  onIncrease,
  onDecrease,
  onAddToCart,
}: ProductMobileBuyBarProps) {
  const needsSize = hasSizes && !selectedSize
  const needsColor = hasColors && !selectedColor
  const isSoldOut = !needsSize && !needsColor && currentStock === 0
  const canAdd = !isSoldOut && !needsSize && !needsColor

  const label = isSoldOut
    ? 'Esgotado'
    : needsSize
      ? 'Escolha o tamanho'
      : needsColor
        ? 'Escolha a cor'
        : 'Adicionar à sacola'

  // resumo da variação escolhida — só os eixos que o produto tem
  const variantSummary = [
    hasColors && selectedColor,
    hasSizes && selectedSize ? `Tam. ${selectedSize}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="sticky bottom-0 z-40 border-t border-nxborder bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur lg:hidden">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-nxi3">
          {variantSummary}
        </span>
        <span className="flex shrink-0 items-baseline gap-2">
          {hasDiscount && (
            <span className="text-[11px] text-nxi3 line-through">{formatPrice(originalPrice)}</span>
          )}
          <span className="text-[16px] font-extrabold tabular-nums text-nxi1">
            {formatPrice(finalPrice?.toString() || originalPrice)}
          </span>
        </span>
      </div>
      <div className="flex items-stretch gap-2">
        <div className="flex items-center rounded-full bg-nxbg">
          <button
            onClick={onDecrease}
            disabled={quantity <= 1}
            className="flex h-11 w-10 items-center justify-center rounded-full text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-30"
            aria-label="Diminuir quantidade"
          >
            <Minus size={15} />
          </button>
          <span className="w-6 text-center text-[14px] font-semibold tabular-nums text-nxi1">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            disabled={currentStock > 0 && quantity >= currentStock}
            className="flex h-11 w-10 items-center justify-center rounded-full text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-30"
            aria-label="Aumentar quantidade"
          >
            <Plus size={15} />
          </button>
        </div>
        <button
          onClick={onAddToCart}
          disabled={!canAdd || isAddingToCart}
          className={cn(
            'flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-95',
            canAdd ? 'bg-store text-white' : 'bg-nxbg text-nxi3',
          )}
        >
          {isAddingToCart ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {isSoldOut ? <Ban size={16} /> : <ShoppingBag size={16} />}
              {label}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
