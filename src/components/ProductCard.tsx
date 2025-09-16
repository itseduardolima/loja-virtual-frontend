'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { ProductCardProps } from '@/app/loja/[slug]/types'
import { formatPrice, buildImageUrl } from '@/lib/utils'

export function ProductCard({ 
  product, 
  onAddToFavorites, 
  onViewDetails,
  showFavorites = true
}: ProductCardProps & { showFavorites?: boolean }) {
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
      className="group relative overflow-hidden bg-white transition-all duration-300 border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      <CardContent className="p-0">
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
            
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                Esgotado
              </Badge>
            )}
          </div>

          {/* Botões de Ação */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {showFavorites && (
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
                onClick={() => onAddToFavorites?.(product)}
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
            
          </div>

        </div>

        {/* Informações do Produto */}
        <div className="p-3 space-y-2">
          {/* Nome do Produto */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 transition-colors">
            {product.name}
          </h3>

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

          {/* Cores e Tamanhos */}
          <div className="space-y-1">
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Cores:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorValue(color) }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{product.colors.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Tamanhos:</span>
                <span className="text-xs text-gray-700">
                  {product.sizes.slice(0, 3).join(', ')}
                  {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Função auxiliar para obter valor de cor
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
    'Laranja': '#FFA500',
    'Cinza': '#808080',
    'Marrom': '#A52A2A',
    'Bege': '#F5F5DC'
  }
  
  return colorMap[color] || '#E5E7EB'
}
