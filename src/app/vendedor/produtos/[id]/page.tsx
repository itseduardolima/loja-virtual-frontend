'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Badge, LoadingSpinner, ErrorState, ConfirmDialog } from '@/components'
import {
  Package,
  Edit,
  Trash2,
  Star,
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useProductDetailPage } from './useProductDetailPage'
import { buildImageUrl, formatPrice } from '@/lib/utils'
import LoadingPage from '@/components/Layout/LoadingPage'
import { getColorHex } from '@/schemas'

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
    selectedColor,
    currentImages,
    imagesByColor,
    buildImageUrls,
    getStatusInfo,
    selectColor,
    selectImage,
    openDeleteDialog,
    handleDeleteProduct,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting
  } = useProductDetailPage(productId)


  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user || user.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingPage />
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
          onRetry={() => router.push('/vendedor/produtos')}
          retryText="Voltar para produtos"
        />
      </div>
    )
  }

  // Calcular rating (mockado por enquanto)
  const rating = 4.5
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto pt-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images - Vertical */}
            {currentImages && currentImages.length > 1 && (
              <div className="flex flex-col gap-3">
                {currentImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-[100px] h-[100px]"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative min-h-[800px] rounded-2xl overflow-hidden">
              {currentImages && currentImages.length > 0 ? (
                <Image
                  src={buildImageUrls(currentImages)[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-6 w-[70%]">
            {/* Product Title */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {product.featured === 1 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Destaque
                  </Badge>
                )}
                <Badge className={getStatusInfo(product.status).color}>
                  {getStatusInfo(product.status).text}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-primary mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {hasHalfStar && (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  )}
                  {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm text-primary/60">({rating}/5)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {formatPrice(product.final_price?.toString() || product.price)}
              </span>
              {/* Se houver desconto, mostrar preço original riscado e badge */}
              {product.discount_price !== null && product.discount_price !== undefined && product.discount_percentage && product.discount_percentage > 0 && (
                <>
                  <span className="text-2xl text-primary/30 line-through font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-1">
                    -{Math.floor(product.discount_percentage)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-primary font-integral">
              <span className="font-integral tracking-wide">Estoque:</span>
              <span>
                {product.stock > 0 ? `${product.stock} unidade${product.stock > 1 ? 's' : ''}` : 'Sem estoque'}
              </span>
            </div>

            {/* Description */}
            <p className="text-primary/60 text-base leading-relaxed">
              {product.description}
            </p>

            {/* Select Colors */}
            {Object.keys(imagesByColor).length > 0 ? (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(imagesByColor).map((color) => {
                    const colorValue = getColorHex(color)
                    const isSelected = selectedColor === color
                    const hasImages = imagesByColor[color] && imagesByColor[color].length > 0

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (hasImages) {
                            selectColor(color)
                          }
                        }}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all p-0 cursor-pointer ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${!hasImages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ backgroundColor: colorValue }}
                        title={hasImages ? color : `${color} (sem imagens)`}
                        disabled={!hasImages}
                      >
                        {colorValue === '#FFFFFF' && (
                          <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                
              </div>
            ) : product.color ? (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Cor disponível:</span>
                <div className="flex gap-3 items-center">
                  <div
                    className="relative w-10 h-10 rounded-full border-2 transition-all"
                    style={{ backgroundColor: getColorHex(product.color) }}
                    title={product.color}
                  >
                    {getColorHex(product.color) === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                    )}
                  </div>
                  <span className="text-sm text-primary/60">{product.color}</span>
                </div>
              </div>
            ) : product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'cor') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
                <div className="flex gap-3 flex-wrap">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'cor')
                    ?.value.split(',')
                    .map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      const colorValue = getColorHex(trimmedColor)

                      return (
                        <div
                          key={colorIndex}
                          className="relative w-10 h-10 rounded-full border-2 transition-all"
                          style={{ backgroundColor: colorValue }}
                          title={trimmedColor}
                        >
                          {colorValue === '#FFFFFF' && (
                            <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Choose Size */}
            {product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'tamanho') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Tamanhos disponíveis:</span>
                <div className="grid grid-cols-5 gap-2">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'tamanho')
                    ?.value.split(',')
                    .map((size, sizeIndex) => {
                      const trimmedSize = size.trim()

                      return (
                        <span
                          key={sizeIndex}
                          className="px-8 py-2 rounded text-sm bg-[#F0F0F0] text-primary/60 text-center"
                        >
                          {trimmedSize}
                        </span>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                className="flex-1 h-12 text-lg"
                onClick={() => router.push(`/vendedor/produtos/editar/${productId}`)}
              >
                <Edit className="h-5 w-5 mr-2" />
                Editar Produto
              </Button>
              <Button
                variant="destructive"
                className="h-12 px-4"
                onClick={openDeleteDialog}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>


          </div>
        </div>
      </div>

      {/* Specifications (Bottom Section) */}
      {product.specifications && (
        <div className="border-t">
          <div className="max-w-4xl px-4 py-10">
            <h2 className="text-xl font-bold text-primary mb-3">Especificações</h2>
            <div
              className="text-primary/60 text-base leading-relaxed prose prose-sm max-w-none prose-headings:text-primary/80 prose-p:text-primary/60 prose-ul:text-primary/60 prose-ol:text-primary/60 prose-strong:text-primary/80"
              dangerouslySetInnerHTML={{ __html: product.specifications }}
            />
          </div>
        </div>
      )}

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
