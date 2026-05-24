'use client'

import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components'

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
  const isOutOfStock = currentStock === 0
  const canAddToCart =
    !isOutOfStock &&
    (!hasColors || !!selectedColor) &&
    (!hasSizes || !!selectedSize) &&
    quantity > 0

  const buttonLabel = isAddingToCart ? null
    : hasSizes && !selectedSize ? 'Selecione o tamanho'
    : hasColors && !selectedColor ? 'Selecione a cor'
    : isOutOfStock ? 'Produto Esgotado'
    : 'Adicionar ao Carrinho'

  const showHint = !canAddToCart && !isOutOfStock
  const needsBoth = hasSizes && !selectedSize && hasColors && !selectedColor
  const needsSize = hasSizes && !selectedSize && (!hasColors || !!selectedColor)
  const needsColor = hasColors && !selectedColor && (!hasSizes || !!selectedSize)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-0">
        <div className="flex items-center bg-gray-100 rounded-full shadow-sm w-auto justify-center">
          <button
            onClick={onDecrease}
            disabled={quantity <= 1}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full active:bg-gray-200 touch-manipulation flex items-center justify-center"
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-4 w-4 text-primary" />
          </button>
          <span className="px-3 sm:px-4 py-2 font-medium min-w-[2.5rem] text-center text-primary text-sm sm:text-base">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            disabled={quantity >= currentStock}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full active:bg-gray-200 touch-manipulation flex items-center justify-center"
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-4 w-4 text-primary" />
          </button>
        </div>

        <Button
          id="add-to-cart-button"
          className="flex-1 h-12 text-base sm:text-lg font-medium shadow-sm active:scale-[0.98] transition-transform touch-manipulation"
          onClick={onAddToCart}
          disabled={!canAddToCart || isAddingToCart}
        >
          {isAddingToCart ? <LoadingSpinner size="sm" /> : buttonLabel}
        </Button>
      </div>

      {showHint && (
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2 px-2">
          {needsBoth && 'Selecione o tamanho e a cor'}
          {needsSize && 'Selecione o tamanho'}
          {needsColor && 'Selecione a cor'}
        </p>
      )}
    </>
  )
}
