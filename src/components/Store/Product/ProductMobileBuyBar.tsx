'use client'

import { ShoppingBag, Ban, Loader2 } from 'lucide-react'
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
  isAddingToCart: boolean
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
  isAddingToCart,
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
        : 'Comprar'

  return (
    <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-nxborder bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="shrink-0">
        {hasDiscount && (
          <div className="text-[10px] text-nxi3 line-through">{formatPrice(originalPrice)}</div>
        )}
        <div className="text-[17px] font-extrabold text-nxi1">
          {formatPrice(finalPrice?.toString() || originalPrice)}
        </div>
      </div>
      <button
        onClick={onAddToCart}
        disabled={!canAdd || isAddingToCart}
        className={cn(
          'ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-transform active:scale-95',
          canAdd ? 'bg-nxp text-white' : 'bg-nxbg text-nxi3',
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
  )
}
