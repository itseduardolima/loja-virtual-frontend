'use client'

import { cn } from '@/lib/utils'

interface ProductSizeSelectorProps {
  sizes: string
  selectedSize: string | null
  onSelectSize: (size: string) => void
  /** estoque por tamanho (considerando a cor ativa); undefined = sem dado de variante */
  stockForSize?: (size: string) => number | null
}

export function ProductSizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  stockForSize,
}: ProductSizeSelectorProps) {
  const sizeList = sizes.split(',').map((s) => s.trim())

  return (
    <div className="mt-6">
      <div className="mb-2.5 flex items-baseline gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
          Tamanho
        </span>
        {selectedSize && <span className="text-[13px] font-semibold text-nxi1">{selectedSize}</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizeList.map((size) => {
          const stock = stockForSize ? stockForSize(size) : null
          const isOut = stock === 0
          const isSelected = selectedSize === size
          return (
            <button
              key={size}
              type="button"
              onClick={() => !isOut && onSelectSize(size)}
              disabled={isOut}
              aria-pressed={isSelected}
              className={cn(
                'relative h-11 rounded-lg text-[13.5px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-95',
                isOut
                  ? 'cursor-not-allowed bg-nxbg text-nxi3'
                  : isSelected
                    ? 'bg-store text-white'
                    : 'bg-nxbg text-nxi2 hover:bg-nxborder',
              )}
            >
              {size}
              {isOut && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="h-px w-7 rotate-[-18deg] bg-nxi3" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
