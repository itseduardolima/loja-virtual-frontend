'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button, Badge, LoadingSpinner, ErrorState, CartSidebar } from '@/components'
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Palette,
  Ruler
} from 'lucide-react'
import Image from 'next/image'

import { buildImageUrl } from '@/lib/utils'
import { useProductDetailPage } from './useProductDetailPage'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const productId = params.id as string
  const [isCartOpen, setIsCartOpen] = useState(false)

  const {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    formatPrice,
    selectImage,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    addToFavorites,
    isAddingToCart,
    isAddingToFavorites
  } = useProductDetailPage(slug, productId)

  // Hook do carrinho para mostrar contador
  const { totalItems } = useCart(product?.store?.id)

  const getColorValue = (colorName: string): string => {
    return colorMap[colorName] || '#6B7280'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Carregando produto..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message="Erro ao carregar produto"
          onRetry={() => window.location.reload()}
          retryText="Tentar novamente"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message="Produto não encontrado"
          onRetry={() => router.push(`/loja/${slug}`)}
          retryText="Voltar para a loja"
        />
      </div>
    )
  }

  const isOutOfStock = product.stock === 0
  const canAddToCart = !isOutOfStock && selectedSize && selectedColor && quantity > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/loja/${slug}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-text-dark"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para a loja
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToFavorites()}
                disabled={isAddingToFavorites}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Favoritos
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                Carrinho ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group shadow-lg">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={buildImageUrls(product.images)[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    Destaque
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive">
                    Esgotado
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-3">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-text-dark">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-text-dark">Tamanho:</span>
                  {selectedSize && (
                    <span className="text-sm text-gray-600">({selectedSize})</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {processSizes(product.sizes).map((size: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => selectSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary-foreground text-primary'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-text-dark">Cor:</span>
                  {selectedColor && (
                    <span className="text-sm text-gray-600">({selectedColor})</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {processColors(product.colors).map((color: string, index: number) => {
                    const colorValue = getColorValue(color)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => selectColor(color)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: colorValue }}
                        title={color}
                      >
                        
                        {/* Borda branca para cores claras */}
                        {colorValue === '#FFFFFF' && (
                          <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <span className="font-medium text-text-dark">Quantidade:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} disponíveis
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4 pt-6">
              <Button
                className="w-full h-12 text-lg font-medium"
                onClick={() => addToCart()}
                disabled={!canAddToCart || isAddingToCart}
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                  </>
                )}
              </Button>
              
              {!canAddToCart && !isOutOfStock && (
                <p className="text-sm text-gray-500 text-center">
                  {!selectedSize && !selectedColor && 'Selecione o tamanho e a cor'}
                  {!selectedSize && selectedColor && 'Selecione o tamanho'}
                  {selectedSize && !selectedColor && 'Selecione a cor'}
                </p>
              )}
            </div>

            {/* Shipping Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-green-500" />
                <span>Frete grátis para pedidos acima de R$ 99</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5 text-purple-500" />
                <span>Troca e devolução gratuita</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={product?.store?.id}
      />
    </div>
  )
}
