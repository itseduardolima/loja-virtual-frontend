'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Badge, LoadingSpinner, ErrorState, ConfirmDialog } from '@/components'
import {
  Edit,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  LayoutList,
  Check,
  X
} from 'lucide-react'
import { EmptyImageState } from '@/components/Product/EmptyImageState'
import { useState } from 'react'
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
    previousImage,
    nextImage,
    openDeleteDialog,
    handleDeleteProduct,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    reorderMode,
    reorderedImagesByColor,
    enterReorderMode,
    cancelReorder,
    handleReorderImages,
    saveImageOrder,
    isSavingOrder
  } = useProductDetailPage(productId)

  // Local drag state for thumbnail reorder
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Product Images */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all ${reorderMode ? 'ring-2 ring-primary/30 rounded-2xl p-2 sm:p-3 bg-primary/[0.02]' : ''}`}>
            {/* Thumbnail Images - Horizontal em mobile, Vertical em desktop */}
            {currentImages && currentImages.length > 1 && (
              <div className="flex flex-col gap-2 order-2 sm:order-1">
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                  {(reorderMode && selectedColor
                    ? (reorderedImagesByColor[selectedColor] ?? currentImages)
                    : currentImages
                  ).map((image: string, index: number) => {
                    const isDragging = reorderMode && dragIndex === index
                    const isDropTarget = reorderMode && dragOverIndex === index && dragIndex !== index
                    return (
                      <div
                        key={index}
                        draggable={reorderMode}
                        onDragStart={reorderMode ? (e) => {
                          e.stopPropagation()
                          setDragIndex(index)
                          e.dataTransfer.effectAllowed = 'move'
                          e.dataTransfer.setData('text/plain', String(index))
                        } : undefined}
                        onDragOver={reorderMode ? (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          e.dataTransfer.dropEffect = 'move'
                          if (dragOverIndex !== index) setDragOverIndex(index)
                        } : undefined}
                        onDrop={reorderMode ? (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (dragIndex === null || dragIndex === index || !selectedColor) {
                            setDragIndex(null)
                            setDragOverIndex(null)
                            return
                          }
                          const items = [...(reorderedImagesByColor[selectedColor] ?? currentImages)]
                          const [removed] = items.splice(dragIndex, 1)
                          items.splice(index, 0, removed)
                          handleReorderImages(selectedColor, items)
                          setDragIndex(null)
                          setDragOverIndex(null)
                        } : undefined}
                        onDragEnd={reorderMode ? () => {
                          setDragIndex(null)
                          setDragOverIndex(null)
                        } : undefined}
                        onClick={() => !reorderMode && selectImage(index)}
                        className={`relative group rounded-lg sm:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0
                          ${!reorderMode && selectedImageIndex === index ? 'border-primary' : ''}
                          ${!reorderMode && selectedImageIndex !== index ? 'border-gray-200 hover:border-gray-300 active:border-primary' : ''}
                          ${reorderMode ? 'cursor-grab active:cursor-grabbing border-gray-200' : 'cursor-pointer'}
                          ${isDropTarget ? 'ring-2 ring-primary ring-offset-1 border-primary' : ''}
                          ${isDragging ? 'opacity-40 scale-95' : ''}
                        `}
                      >
                        <Image
                          src={buildImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px] select-none"
                          sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 100px"
                          draggable={false}
                        />
                        {reorderMode && index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-white text-[9px] font-semibold px-1 py-0.5 rounded leading-none">
                            Principal
                          </div>
                        )}
                        {reorderMode && (
                          <div className="absolute top-1 right-1 bg-black/40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {reorderMode && (
                  <p className="text-[10px] text-primary/40 text-center hidden sm:block">
                    Arraste para reordenar
                  </p>
                )}
              </div>
            )}

            {/* Main Image */}
            <div className="w-full sm:flex-1 relative rounded-2xl overflow-hidden order-1 sm:order-2 min-w-0 h-[60vh] sm:h-auto">
              {currentImages && currentImages.length > 0 ? (
                <>
                  <Image
                    src={buildImageUrls(
                      reorderMode && selectedColor
                        ? (reorderedImagesByColor[selectedColor] ?? currentImages)
                        : currentImages
                    )[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* Reorder mode indicator */}
                  {reorderMode && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-2.5 py-1.5 rounded-full shadow-lg">
                      <GripVertical className="h-3 w-3" />
                      Reordenando
                    </div>
                  )}
                  {/* Navegação de imagens em mobile - setas */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all active:scale-95 lg:hidden z-10 touch-manipulation"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all active:scale-95 lg:hidden z-10 touch-manipulation"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </button>
                      {/* Indicador de imagem atual */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden z-10">
                        {currentImages.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              selectedImageIndex === index
                                ? 'w-6 bg-primary'
                                : 'w-2 bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <EmptyImageState iconSize="md" />
              )}
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Product Title */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                {product.featured === 1 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm">
                    Destaque
                  </Badge>
                )}
                <Badge className={`${getStatusInfo(product.status).color} text-xs sm:text-sm`}>
                  {getStatusInfo(product.status).text}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {hasHalfStar && (
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  )}
                  {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-primary/60">({rating}/5)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                {formatPrice(product.final_price?.toString() || product.price)}
              </span>
              {/* Se houver desconto, mostrar preço original riscado e badge */}
              {product.discount_price !== null && product.discount_price !== undefined && product.discount_percentage && product.discount_percentage > 0 && (
                <>
                  <span className="text-lg sm:text-xl lg:text-2xl text-primary/30 line-through font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-1 text-xs sm:text-sm">
                    -{Math.floor(product.discount_percentage)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-primary font-integral text-sm sm:text-base">
              <span className="font-integral tracking-wide">Estoque:</span>
              <span>
                {product.stock > 0 ? `${product.stock} unidade${product.stock > 1 ? 's' : ''}` : 'Sem estoque'}
              </span>
            </div>

            {/* Description - Desktop only */}
            <p className="hidden sm:block text-primary/60 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Select Colors */}
            {Object.keys(imagesByColor).length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
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
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all p-0 cursor-pointer active:scale-95 touch-manipulation ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${!hasImages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ backgroundColor: colorValue }}
                        title={hasImages ? color : `${color} (sem imagens)`}
                        disabled={!hasImages}
                        aria-label={`Selecionar cor ${color}`}
                      >
                        {colorValue === '#FFFFFF' && (
                          <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : product.color ? (
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm font-medium text-primary/60">Cor disponível:</span>
                <div className="flex gap-2 sm:gap-3 items-center">
                  <div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all"
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
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'cor')
                    ?.value.split(',')
                    .map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      const colorValue = getColorHex(trimmedColor)

                      return (
                        <div
                          key={colorIndex}
                          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all"
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
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm  text-primary/60">Tamanhos disponíveis:</span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'tamanho')
                    ?.value.split(',')
                    .map((size, sizeIndex) => {
                      const trimmedSize = size.trim()

                      return (
                        <span
                          key={sizeIndex}
                          className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm bg-[#F0F0F0] text-primary/60 text-center"
                        >
                          {trimmedSize}
                        </span>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {reorderMode ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 sm:h-12 text-base font-medium active:scale-[0.98] transition-transform touch-manipulation"
                    onClick={cancelReorder}
                    disabled={isSavingOrder}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 h-12 sm:h-12 text-base font-medium active:scale-[0.98] transition-transform touch-manipulation"
                    onClick={saveImageOrder}
                    disabled={isSavingOrder}
                  >
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {isSavingOrder ? 'Salvando...' : 'Salvar ordem'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1 h-12 sm:h-12 text-base sm:text-lg font-medium active:scale-[0.98] transition-transform touch-manipulation"
                    onClick={() => router.push(`/vendedor/produtos/editar/${productId}`)}
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Editar Produto
                  </Button>
                  {Object.keys(imagesByColor).length > 0 && (
                    <Button
                      variant="outline"
                      className="h-12 sm:h-12 px-4 active:scale-[0.98] transition-transform touch-manipulation"
                      onClick={enterReorderMode}
                      title="Reordenar imagens"
                    >
                      <LayoutList className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="h-12 sm:h-12 px-4 sm:px-4 active:scale-[0.98] transition-transform touch-manipulation"
                    onClick={openDeleteDialog}
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Description and Specifications (Bottom Section) */}
      {(product.description || product.specifications) && (
        <div className="border-t">
          <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* Description - Mobile only */}
            {product.description && (
              <div className="sm:hidden mb-6">
                <h2 className="text-lg font-bold text-primary mb-3">Descrição</h2>
                <p className="text-primary/60 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            
            {/* Specifications */}
            {product.specifications && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">
                  Especificações
                </h2>
                <div
                  className="text-primary/60 text-sm sm:text-base leading-relaxed prose prose-sm max-w-none prose-headings:text-primary/80 prose-p:text-primary/60 prose-ul:text-primary/60 prose-ol:text-primary/60 prose-strong:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: product.specifications }}
                />
              </>
            )}
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
