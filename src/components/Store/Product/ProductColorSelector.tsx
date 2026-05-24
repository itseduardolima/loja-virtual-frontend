'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getColorHex } from '@/schemas'

interface ProductColorSelectorProps {
  singleColor?: string
  dynamicColors?: string
  selectedColor: string | null
  onSelectColor: (color: string) => void
}

function ColorSwatch({
  color,
  isSelected,
  onSelect,
}: {
  color: string
  isSelected: boolean
  onSelect: () => void
}) {
  const colorValue = getColorHex(color)
  const isWhite =
    colorValue === '#FFFFFF' ||
    colorValue.toLowerCase() === '#ffffff' ||
    colorValue.toLowerCase() === 'white'

  return (
    <Button
      onClick={onSelect}
      className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all p-0 active:scale-95 touch-manipulation"
      style={{ backgroundColor: colorValue }}
      title={color}
      aria-label={`Selecionar cor ${color}`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check
            className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] ${isWhite ? 'text-primary' : 'text-white'}`}
          />
        </div>
      )}
      {isWhite && <div className="absolute inset-0 rounded-full border border-gray-400" />}
    </Button>
  )
}

export function ProductColorSelector({
  singleColor,
  dynamicColors,
  selectedColor,
  onSelectColor,
}: ProductColorSelectorProps) {
  if (singleColor) {
    return (
      <div className="space-y-2 sm:space-y-3">
        <span className="text-sm font-medium text-primary/60">Cor disponível:</span>
        <div className="flex gap-2 sm:gap-3 items-center">
          <ColorSwatch
            color={singleColor}
            isSelected={selectedColor === singleColor}
            onSelect={() => onSelectColor(singleColor)}
          />
        </div>
      </div>
    )
  }

  if (dynamicColors) {
    const colors = dynamicColors.split(',').map((c) => c.trim())
    return (
      <div className="space-y-2 sm:space-y-3">
        <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {colors.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color}
              isSelected={selectedColor === color}
              onSelect={() => onSelectColor(color)}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}
