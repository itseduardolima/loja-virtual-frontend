'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Badge, LoadingSpinner, ErrorState, ConfirmDialog } from '@/components'
import {
  Package,
  Edit,
  Trash2,
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useProductDetailPage } from './useProductDetailPage'
import { buildImageUrl, formatPrice } from '@/lib/utils'
import { useEffect } from 'react'
import LoadingPage from '@/components/LoadingPage'

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

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images - Vertical */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      width={152}
                      height={167}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative  rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={buildImageUrls(product.images)[selectedImageIndex]}
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
              <h1 className="text-4xl font-bold text-black mb-4 uppercase font-integral">
                {removeAccents(product.name)}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-black/60 text-base leading-relaxed">
              {product.description}
            </p>

            {/* Select Colors */}
            {product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'cor') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-black/60">Cores disponíveis:</span>
                <div className="flex gap-3">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'cor')
                    ?.value.split(',')
                    .map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      const colorValue = getColorValue(trimmedColor)

                      return (
                        <Button
                          key={colorIndex}
                          className="relative w-10 h-10 rounded-full border-2 transition-all p-0"
                          style={{ backgroundColor: colorValue }}
                          title={trimmedColor}
                        >
                          {colorValue === '#FFFFFF' && (
                            <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                          )}
                        </Button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Choose Size */}
            {product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'tamanho') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-black/60">Tamanhos disponíveis:</span>
                <div className="grid grid-cols-5 gap-2">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'tamanho')
                    ?.value.split(',')
                    .map((size, sizeIndex) => {
                      const trimmedSize = size.trim()

                      return (
                        <span
                          key={sizeIndex}
                          className="px-8 py-2 rounded text-sm bg-[#F0F0F0] text-black/60 text-center"
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
