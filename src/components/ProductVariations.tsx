'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Ruler, Check } from 'lucide-react'
import { getColorHex } from '@/schemas'

const SIZE_OPTIONS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
const COLOR_OPTIONS = [
  'Azul', 'Vermelho', 'Preto', 'Branco', 'Verde', 'Amarelo', 'Rosa', 'Roxo',
  'Laranja', 'Cinza', 'Marrom', 'Bege', 'Azul Marinho', 'Verde Oliva', 'Coral',
  'Turquesa', 'Magenta', 'Dourado', 'Prata', 'Cobre'
]

interface ProductVariationsProps {
  selectedSizes: string[]
  selectedColors: string[]
  onToggleSize: (size: string) => void
  onToggleColor: (color: string) => void
  title?: string
  description?: string
}

export function ProductVariations({
  selectedSizes,
  selectedColors,
  onToggleSize,
  onToggleColor,
  title = "Variações do Produto",
  description = "Tamanhos e cores disponíveis"
}: ProductVariationsProps) {
  return (
    <Card className="p-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Ruler className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tamanhos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tamanhos Disponíveis
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {SIZE_OPTIONS.map((size) => (
              <Button
                key={size}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleSize(size)}
                className={`h-12 font-semibold transition-all duration-200 relative ${
                  selectedSizes.includes(size)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
                {selectedSizes.includes(size) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>

        </div>

        {/* Cores */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cores Disponíveis
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {COLOR_OPTIONS.map((color) => (
              <Button
                key={color}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleColor(color)}
                className={`h-14 flex items-center gap-3 px-3 transition-all duration-200 relative ${
                  selectedColors.includes(color)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor: getColorHex(color),
                    borderColor: selectedColors.includes(color) ? '#3b82f6' : '#d1d5db'
                  }}
                />
                <span className="text-xs font-medium truncate">{color}</span>
                {selectedColors.includes(color) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>

        </div>
      </div>
    </Card>
  )
}
