'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'
import { ProductCardProps } from '@/app/loja/[slug]/types'
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
      className="group relative overflow-hidden bg-white transition-all duration-300 border-0 min-h-[400px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Container da Imagem */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <Image
              src={buildImageUrl(product.images[currentImageIndex])}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 transition-colors">
              {product.name}
            </h3>

            <span className={`text-xs font-medium ${product.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
              {product.status === 1 ? 'Disponível' : 'Esgotado'}
            </span>
          </div>

          {/* Categoria */}
          {product.category && (
            <p className="text-xs text-gray-500">
              {product.category.name}
            </p>


          )}

          {/* Preço */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-text-dark">
              {formatPrice(product.price)}
            </span>
            {!isOutOfStock && (
              <span className="text-xs text-gray-500">
                {product.stock} em estoque
              </span>
            )}
          </div>

          {/* Campos Dinâmicos */}
          {product.dynamic_fields && product.dynamic_fields.length > 0 && (
            <div className="space-y-1">
              {product.dynamic_fields.slice(0, 4).map((field, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{field.field_name}:</span>
                  {field.field_name.toLowerCase() === 'cor' ? (
                    <div className="flex gap-1">
                      {field.value.split(',').slice(0, 4).map((color, colorIndex) => {
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
                      {field.value.split(',').length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{field.value.split(',').length - 4}
                        </span>
                      )}
                    </div>
                  ) : (
                    field.field_name.toLowerCase() === 'material' || field.field_name.toLowerCase() === 'tipo de sola' ? (
                      <div className="flex gap-1">
                        {field.value.split(',').slice(0, 2).map((item, itemIndex) => (
                          <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                            {item.trim()}
                            {itemIndex < 1 && field.value.split(',').length > 1 ? ',' : ''}
                          </span>
                        ))}
                        {field.value.split(',').length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{field.value.split(',').length - 2} mais
                          </span>
                        )}
                      </div>
                    ) : field.field_name.toLowerCase() === 'gênero' ? (
                      <div className="flex gap-1">
                        {(() => {
                          const values = field.value.split(',').map(v => v.trim())
                          const hasMasculino = values.includes('Masculino')
                          const hasFeminino = values.includes('Feminino')

                          if (hasMasculino && hasFeminino) {
                            return <span className="text-xs text-gray-700 font-medium">Unissex</span>
                          }

                          return field.value.split(',').slice(0, 2).map((item, itemIndex) => (
                            <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                              {item.trim()}
                              {itemIndex < 1 && field.value.split(',').length > 1 ? ',' : ''}
                            </span>
                          ))
                        })()}
                        {field.value.split(',').length > 2 && !(field.value.split(',').map(v => v.trim()).includes('Masculino') && field.value.split(',').map(v => v.trim()).includes('Feminino')) && (
                          <span className="text-xs text-gray-500">
                            +{field.value.split(',').length - 2} mais
                          </span>
                        )}
                      </div>
                    ) : field.field_name.toLowerCase() === 'numeração' ? (
                      <div className="flex gap-1">
                        {field.value.split(',').slice(0, 3).map((item, itemIndex) => (
                          <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                            {item.trim()}
                            {itemIndex < 2 && field.value.split(',').length > 1 ? ',' : ''}
                          </span>
                        ))}
                        {field.value.split(',').length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{field.value.split(',').length - 3} mais
                          </span>
                        )}
                      </div>
                    ) : field.field_name.toLowerCase() === 'tamanho' ? (
                      <div className="flex gap-1">
                        {field.value.split(',').slice(0, 4).map((item, itemIndex) => (
                          <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                            {item.trim()}
                            {itemIndex < 3 && field.value.split(',').length > 1 ? ',' : ''}
                          </span>
                        ))}
                        {field.value.split(',').length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{field.value.split(',').length - 4} mais
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-700 font-medium">
                        {field.value}
                      </span>
                    )
                  )}
                </div>
              ))}
              {product.dynamic_fields.length > 4 && (
                <div className="text-xs text-gray-400">
                  +{product.dynamic_fields.length - 4} mais
                </div>
              )}
            </div>
          )}




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
