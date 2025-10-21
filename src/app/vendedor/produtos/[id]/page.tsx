'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Badge, LoadingSpinner, ErrorState, ConfirmDialog } from '@/components'
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
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  CreditCard,
  Clock,
  DollarSign
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useProductDetailPage } from './useProductDetailPage'
import { buildImageUrl, formatPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function ProductDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [showDetails, setShowDetails] = useState(false)

  const {
    product,
    isLoading,
    error,
    selectedImageIndex,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    getStatusInfo,
    selectImage,
    previousImage,
    nextImage,
    openDeleteDialog,
    handleDeleteProduct,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting
  } = useProductDetailPage(productId)

  const getColorValue = (colorName: string): string => {
    return colorMap[colorName] || '#6B7280' // Cinza como fallback
  }

  // Suporte a navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (product && product.images && product.images.length > 1) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          previousImage()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          nextImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product, previousImage, nextImage])

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


      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
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

              {/* Navigation Controls */}
              {product.images && product.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition-all duration-200"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition-all duration-200"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="space-y-2">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === index
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
              <span className="text-4xl font-bold text-text-dark">
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

            {/* Product Specifications */}
            <div className="space-y-4">
              {/* Dynamic Fields Display */}
              {product.dynamic_fields && product.dynamic_fields.length > 0 && (
                <div className="space-y-4">
                  {/* Campos principais (Tamanho e Cor) */}
                  {product.dynamic_fields
                    .filter(field =>
                      field.field_name.toLowerCase() === 'tamanho' ||
                      field.field_name.toLowerCase() === 'cor'
                    )
                    .map((field, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center gap-2">
                          {field.field_name.toLowerCase() === 'tamanho' ? (
                            <Ruler className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Palette className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium text-gray-900">{field.field_name}:</span>
                        </div>

                        {field.field_name.toLowerCase() === 'cor' ? (
                          <div className="flex flex-wrap gap-2">
                            {field.value.split(',').map((color, colorIndex) => {
                              const trimmedColor = color.trim()
                              const colorValue = getColorValue(trimmedColor)

                              return (
                                <div
                                  key={colorIndex}
                                  className="relative w-8 h-8 rounded-full border border-gray-300"
                                  style={{ backgroundColor: colorValue }}
                                  title={trimmedColor}
                                >
                                  {/* Borda branca para cores claras */}
                                  {colorValue === '#FFFFFF' && (
                                    <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {field.value.split(',').map((size, sizeIndex) => (
                              <span
                                key={sizeIndex}
                                className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"
                              >
                                {size.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Stock Information */}
                  <div className="flex items-center justify-between py-3 border-gray-200">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Estoque</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{product.stock} unidades</span>
                  </div>


                  {/* Botão para mostrar/ocultar detalhes */}
                  {product.dynamic_fields.some(field =>
                    field.field_name.toLowerCase() === 'gênero' ||
                    field.field_name.toLowerCase() === 'material'
                  ) && (
                      <div className="border-gray-200 pt-4">
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full justify-between p-2 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Detalhes do produto</span>
                          </div>
                          {showDetails ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {/* Campos de detalhes (Gênero e Material) */}
                        {showDetails && (
                          <div className="mt-4 space-y-3 pl-6">
                            {product.dynamic_fields
                              .filter(field =>
                                field.field_name.toLowerCase() === 'gênero' ||
                                field.field_name.toLowerCase() === 'material'
                              )
                              .map((field, index) => (
                                <div key={index} className="flex items-center gap-3">
                                  <span className="text-sm text-gray-500 w-20">{field.field_name}:</span>
                                  <span className="text-sm text-gray-700">{field.value}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

            </div>


            {/* Additional Information */}
            <div className="space-y-4">
              {/* Delivery Information */}
              {product.delivery_info && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Informações de entrega</span>
                    </div>
                    {showDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showDetails && (
                    <div className="mt-4 space-y-3 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">Taxa de entrega:</span>
                        <span className="text-sm text-gray-700 font-medium">{formatPrice(product.delivery_info.delivery_fee)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">Frete grátis:</span>
                        <span className="text-sm text-gray-700 font-medium">A partir de {formatPrice(product.delivery_info.free_delivery_min)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">Prazo:</span>
                        <span className="text-sm text-gray-700 font-medium">{product.delivery_info.delivery_time}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods */}
              {product.payment_methods && product.payment_methods.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Formas de pagamento</span>
                    </div>
                    {showDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showDetails && (
                    <div className="mt-4 pl-6">
                      <div className="flex flex-wrap gap-2">
                        {product.payment_methods.map((method, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {method === 'pix' ? 'PIX' :
                              method === 'credit_card' ? 'Cartão de Crédito' :
                                method === 'debit_card' ? 'Cartão de Débito' :
                                  method === 'boleto' ? 'Boleto' :
                                    method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-12 text-lg font-medium"
                  onClick={() => router.push(`/vendedor/produtos/editar/${productId}`)}
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Editar Produto
                </Button>
                <Button
                  variant="destructive"
                  onClick={openDeleteDialog}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Deletar Produto"
        description="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteProduct}
        isLoading={isDeleting}
      />
    </div>
  )
}
