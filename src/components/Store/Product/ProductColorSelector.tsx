'use client'

import { Check } from 'lucide-react'
import { getColorHex } from '@/schemas'
import { cn } from '@/lib/utils'

interface ProductColorSelectorProps {
  singleColor?: string
  dynamicColors?: string
  selectedColor: string | null
  onSelectColor: (color: string) => void
}

function colorLuma(hex: string): number {
  try {
    const h = hex.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
  } catch {
    return 0.5
  }
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
  const hex = getColorHex(color)
  const isLight = colorLuma(hex) > 0.82

  return (
    <button
      type="button"
      onClick={onSelect}
      title={color}
      aria-pressed={isSelected}
      aria-label={`Selecionar cor ${color}`}
      className={cn(
        'relative h-11 w-11 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-90',
        isSelected ? 'ring-2 ring-store ring-offset-2' : 'ring-1 ring-nxborder hover:ring-nxi3',
      )}
      style={{ background: hex }}
    >
      {isLight && <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-nxborder" />}
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check size={16} className={cn('stroke-[3]', isLight ? 'text-nxi1' : 'text-white')} />
        </span>
      )}
    </button>
  )
}

export function ProductColorSelector({
  singleColor,
  dynamicColors,
  selectedColor,
  onSelectColor,
}: ProductColorSelectorProps) {
  const colors = singleColor
    ? [singleColor]
    : dynamicColors
      ? dynamicColors.split(',').map((c) => c.trim())
      : []

  if (colors.length === 0) return null

  return (
    <div className="mt-6">
      <div className="mb-2.5 flex items-baseline gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
          Cor
        </span>
        {selectedColor && <span className="text-[13px] font-semibold text-nxi1">{selectedColor}</span>}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onSelect={() => onSelectColor(color)}
          />
        ))}
      </div>
    </div>
  )
}
