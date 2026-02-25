'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {  Star } from 'lucide-react'
import { EmptyImageState } from './EmptyImageState'
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

  const getDisplayName = (name: string) => {
    if (!name) return ''
    return name.length > 30 ? `${name.slice(0, 30)}...` : name
  }

  // Obter imagens disponíveis (prioridade: images_by_color > images como objeto > images como array)
  const getAvailableImages = (): string[] => {
    // Se houver images_by_color, usar a primeira cor disponível
    if (product.images_by_color && Object.keys(product.images_by_color).length > 0) {
      const firstColor = Object.keys(product.images_by_color)[0]
      return product.images_by_color[firstColor] || []
    }
    
    // Se images for um objeto (formato novo), usar a primeira cor disponível
    if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
      const firstColor = Object.keys(product.images)[0]
      return (product.images as Record<string, string[]>)[firstColor] || []
    }
    
    // Fallback para formato antigo (array)
    return Array.isArray(product.images) ? product.images : []
  }

  const availableImages = getAvailableImages()

  const handleImageHover = () => {
    if (availableImages.length > 1) {
      setCurrentImageIndex(1)
    }
  }

  const handleImageLeave = () => {
    setCurrentImageIndex(0)
  }

  const isOutOfStock = product.stock === 0

  return (
    <Card
      className="group relative overflow-hidden shadow-none bg-transparent transition-all duration-300 border-0 min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex flex-col cursor-pointer active:scale-[0.98]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      <CardContent className="p-0 flex flex-col h-full shadow-none bg-transparent">
        {/* Container da Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
          {availableImages.length > 0 ? (
            <Image
              src={buildImageUrl(availableImages[currentImageIndex] || availableImages[0])}
              alt={product.name}
              fill
              className="object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-105"
              onMouseEnter={handleImageHover}
              onMouseLeave={handleImageLeave}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <EmptyImageState className="rounded-xl sm:rounded-2xl" iconSize="sm" />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.featured === 1 && (
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
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
            <h3
              className="font-bold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 flex-1 leading-tight"
              title={product.name}
            >
              {getDisplayName(product.name)}
            </h3>

            {showStatusSwitch && (
              <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0 ${product.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                {product.status === 1 ? 'Disponível' : 'Esgotado'}
              </span>
            )}
          </div>

          {/* Avaliações */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    star <= Math.round(product.average_rating ?? 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {(product.total_reviews ?? 0) > 0
                ? `${(product.average_rating ?? 0).toFixed(1)} (${product.total_reviews ?? 0})`
                : '(0)'}
            </span>
          </div>

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
