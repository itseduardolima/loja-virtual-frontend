'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {  Star } from 'lucide-react'
import { ProductCardProps } from '@/app/loja/[slug]/produtos/types'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { getColorHex } from '@/schemas'

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
      className="group relative overflow-hidden shadow-none bg-transparent transition-all duration-300 border-0 min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      <CardContent className="p-0 flex flex-col h-full shadow-none bg-transparent">
        {/* Container da Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={buildImageUrl(product.images[currentImageIndex])}
              alt={product.name}
              fill
              className="object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-105"
              onMouseEnter={handleImageHover}
              onMouseLeave={handleImageLeave}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl sm:rounded-2xl">
              <span className="text-gray-400 text-xs sm:text-sm">Sem imagem</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.featured === 1 && (
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 font-medium">
                Esgotado
              </Badge>
            )}
          </div>

          {/* Switch de Status - Superior direito */}
          {showStatusSwitch && (
            <div
              className="absolute top-2 right-2 flex items-center gap-2 z-10"
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
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            {/* Nome do Produto */}
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 flex-1 leading-tight">
              {product.name}
            </h3>

            {showStatusSwitch && (
              <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0 ${product.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                {product.status === 1 ? 'Disponível' : 'Esgotado'}
              </span>
            )}
          </div>

          {/* Cores */}
          {product.color ? (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: getColorHex(product.color) }}
                title={product.color}
              />
            </div>
          ) : product.dynamic_fields && product.dynamic_fields.length > 0 && (() => {
            const colorField = product.dynamic_fields.find(
              field => field.field_name.toLowerCase().includes('cor')
            )

            if (colorField) {
              return (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 sm:gap-1">
                    {colorField.value.split(',').slice(0, 5).map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      return (
                        <div
                          key={colorIndex}
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: getColorValue(trimmedColor) }}
                          title={trimmedColor}
                        />
                      )
                    })}
                    {colorField.value.split(',').length > 5 && (
                      <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5">
                        +{colorField.value.split(',').length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )
            }
            return null
          })()}

          {/* Preço */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
              {formatPrice((product.final_price?.toString() || product.price))}
            </span>
            {/* Se houver desconto, mostrar preço original riscado e badge */}
            {product.discount_price !== null && product.discount_price !== undefined && product.discount_percentage && product.discount_percentage > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium">
                  -{Math.floor(product.discount_percentage)}%
                </Badge>
              </>
            )}
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
