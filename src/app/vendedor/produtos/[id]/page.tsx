'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button,  Badge, LoadingSpinner, ErrorState } from '@/components'
import {
  Package,
  ArrowLeft,
  Tag,
  Palette,
  Ruler,
  Edit,
  Trash2,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useProductDetailPage } from './useProductDetailPage'

export default function ProductDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const {
    product,
    isLoading,
    error,
    selectedImageIndex,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    formatPrice,
    getStatusInfo,
    getFeaturedInfo,
    selectImage
  } = useProductDetailPage(productId)

  const getColorValue = (colorName: string): string => {
    return colorMap[colorName] || '#6B7280' // Cinza como fallback
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user || user.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20 flex items-center justify-center">
        <LoadingSpinner message="Carregando produto..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20 flex items-center justify-center">
        <ErrorState
          message="Produto não encontrado"
          onRetry={() => router.push('/vendedor/produtos')}
          retryText="Voltar para produtos"
        />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/vendedor/produtos')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/vendedor')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Package className="h-4 w-4" />
                Dashboard
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
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
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
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-pink-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={buildImageUrls([image])[0]}
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
                {product.featured === 1 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Destaque
                  </Badge>
                )}
                <Badge className={getStatusInfo(product.status).color}>
                  {getStatusInfo(product.status).text}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-pink-600">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Category */}
            {product.category && (
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  <span className="font-medium">Categoria:</span> {product.category.name}
                </span>
              </div>
            )}

            {/* Size Display */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Tamanhos Disponíveis:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {processSizes(product.sizes).map((size, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Color Display */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Cores Disponíveis:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {processColors(product.colors).map((color, index) => {
                    const colorValue = getColorValue(color)
                    
                    return (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: colorValue }}
                        title={color}
                      >
                        {/* Borda branca para cores claras */}
                        {colorValue === '#FFFFFF' && (
                          <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stock Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">Estoque:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{product.stock}</span>
                <span className="text-gray-600">unidades disponíveis</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg font-medium"
                  onClick={() => {/* TODO: Implementar edição */}}
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Editar Produto
                </Button>
                <Button
                  variant="outline"
                  className="px-6 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => {/* TODO: Implementar exclusão */}}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
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
    </div>
  )
}
