'use client'

import { Button } from '@/components/ui/button'

interface ProductSizeSelectorProps {
  sizes: string
  selectedSize: string | null
  onSelectSize: (size: string) => void
}

export function ProductSizeSelector({ sizes, selectedSize, onSelectSize }: ProductSizeSelectorProps) {
  const sizeList = sizes.split(',').map((s) => s.trim())

  return (
    <div className="space-y-2 sm:space-y-3">
      <span className="text-sm font-medium text-primary/60">Tamanhos disponíveis:</span>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {sizeList.map((size, index) => (
          <Button
            key={index}
            onClick={() => onSelectSize(size)}
            className={`px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all active:scale-95 touch-manipulation ${
              selectedSize === size
                ? 'border-primary bg-primary text-white'
                : 'bg-[#F0F0F0] text-primary/60 hover:bg-[#c7c6c6] active:bg-[#c7c6c6]'
            }`}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  )
}
