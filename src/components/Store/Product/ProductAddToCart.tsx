'use client'

import { Plus, Minus, ShoppingBag, Ban, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductAddToCartProps {
  quantity: number
  currentStock: number
  hasColors: boolean
  hasSizes: boolean
  selectedColor: string | null
  selectedSize: string | null
  isAddingToCart: boolean
  onIncrease: () => void
  onDecrease: () => void
  onAddToCart: () => void
}

export function ProductAddToCart({
  quantity,
  currentStock,
  hasColors,
  hasSizes,
  selectedColor,
  selectedSize,
  isAddingToCart,
  onIncrease,
  onDecrease,
  onAddToCart,
}: ProductAddToCartProps) {
  const needsSize = hasSizes && !selectedSize
  const needsColor = hasColors && !selectedColor
  const isSoldOut = !needsSize && !needsColor && currentStock === 0
  const canAdd = !isSoldOut && !needsSize && !needsColor && quantity > 0

  const label = isSoldOut
    ? 'Esgotado'
    : needsSize
      ? 'Selecione o tamanho'
      : needsColor
        ? 'Selecione a cor'
        : 'Adicionar à sacola'

  return (
    <div className="mt-5 flex items-stretch gap-2.5">
      <div className="flex items-center rounded-full bg-nxbg">
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="flex h-12 w-11 items-center justify-center rounded-full text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-30"
          aria-label="Diminuir quantidade"
        >
          <Minus size={16} />
        </button>
        <span className="w-7 text-center text-[15px] font-semibold tabular-nums text-nxi1">
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          disabled={currentStock > 0 && quantity >= currentStock}
          className="flex h-12 w-11 items-center justify-center rounded-full text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-30"
          aria-label="Aumentar quantidade"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        id="add-to-cart-button"
        onClick={onAddToCart}
        disabled={!canAdd || isAddingToCart}
        className={cn(
          'flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-[0.99]',
          canAdd
            ? 'bg-store text-white hover:brightness-[1.05]'
            : 'cursor-not-allowed bg-nxbg text-nxi3',
        )}
      >
        {isAddingToCart ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <>
            {isSoldOut ? <Ban size={17} /> : <ShoppingBag size={17} />}
            {label}
          </>
        )}
      </button>
    </div>
  )
}
