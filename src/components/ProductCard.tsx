'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'
import { ProductCardProps } from '@/app/loja/[slug]/produtos/types'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

export function ProductCard({
  product,
  onAddToFavorites,
  onViewDetails,
  showFavorites = true,
  showStatusSwitch = false,
  onStatusChange,
  isUpdatingStatus = false
}: ProductCardProps & {
  showFavorites?: boolean
  showStatusSwitch?: boolean
  onStatusChange?: (productId: number, currentStatus: number) => void
  isUpdatingStatus?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageHover = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1)
    }
  }

  const handleImageLeave = () => {
    setCurrentImageIndex(0)
  }

  const isOutOfStock = product.stock === 0

  return (
    <Card
      className="group relative overflow-hidden shadow-none bg-transparent transition-all duration-300 border-0 min-h-[400px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      <CardContent className="p-0 flex flex-col h-full shadow-none  bg-transparent">
        {/* Container da Imagem */}
        <div className="relative aspect-square overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={buildImageUrl(product.images[currentImageIndex])}
              alt={product.name}
              fill
              className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              onMouseEnter={handleImageHover}
              onMouseLeave={handleImageLeave}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Sem imagem</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured === 1 && (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                Esgotado
              </Badge>
            )}
          </div>

          {/* Switch de Status - Superior direito */}
          {showStatusSwitch && (
            <div
              className="absolute top-2 right-2 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch
                checked={product.status === 1}
                onCheckedChange={(checked: boolean) => {
                  onStatusChange?.(product.id, product.status)
                }}
                disabled={isUpdatingStatus}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          )}

        </div>

        {/* Informações do Produto */}
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            {/* Nome do Produto */}
            <h3 className="font-bold text-lg text-black line-clamp-2 transition-colors">
              {product.name}
            </h3>

            <span className={`text-xs font-medium ${product.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
              {product.status === 1 ? 'Disponível' : 'Esgotado'}
            </span>
          </div>

          {/* Cores */}
          {product.dynamic_fields && product.dynamic_fields.length > 0 && (() => {
            const colorField = product.dynamic_fields.find(
              field => field.field_name.toLowerCase().includes('cor')
            )

            if (colorField) {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {colorField.value.split(',').slice(0, 6).map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      return (
                        <div
                          key={colorIndex}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: getColorValue(trimmedColor) }}
                          title={trimmedColor}
                        />
                      )
                    })}
                    {colorField.value.split(',').length > 6 && (
                      <span className="text-xs text-gray-400">
                        +{colorField.value.split(',').length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )
            }
            return null
          })()}

          {/* Preço */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-text-dark">
              {formatPrice(product.price)}
            </span>
          </div>



        </div>
      </CardContent>
    </Card>
  )
}

function getColorValue(color: string): string {
  const colorMap: { [key: string]: string } = {
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Azul': '#0000FF',
    'Vermelho': '#FF0000',
    'Verde': '#00FF00',
    'Amarelo': '#FFFF00',
    'Rosa': '#FFC0CB',
    'Roxo': '#800080',
    'Cinza': '#808080',
    'Marrom': '#A52A2A'
  }

  return colorMap[color] || '#E5E7EB'
}
