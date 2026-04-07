'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button, Badge, LoadingSpinner, ErrorState, CartSidebar, StoreHeader, ProductReviews } from '@/components'
import { useProductQuestionsCount } from '@/hooks/useProductQuestions'
import {
  Star,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { EmptyImageState } from '@/components/Product/EmptyImageState'
import Image from 'next/image'

import { buildImageUrl, formatPrice } from '@/lib/utils'
import { useProductDetailPage } from './useProductDetailPage'
import { useProductReviews } from '@/hooks/useProductReviews'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useState, useEffect } from 'react'
import LoadingPage from '@/components/Layout/LoadingPage'
import { getColorHex } from '@/schemas'
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation'
import { AddToCartAnimation } from '@/components/Animation/AddToCartAnimation'
import { AppFooter } from '@/components/Layout/AppFooter'
import { WhatsAppChatWidget } from '@/components/Store/WhatsAppChatWidget'
import { WishlistButton } from '@/components/Product/WishlistButton'
import { ShareButtons } from '@/components/Product/ShareButtons'
import { ProductImageZoom } from '@/components/Product/ProductImageZoom'
import { RecentlyViewedSection } from '@/components/Product/RecentlyViewedSection'
import { ProductQuestions } from '@/components/Product/ProductQuestions'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const productId = params.id as string
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const { storeInfo } = useStoreInfo(slug)
  const { triggerAnimation, animationData, onAnimationComplete } = useAddToCartAnimation()

  const {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    colorMap,
    currentImages,
    buildImageUrls,
    selectImage,
    previousImage,
    nextImage,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    isAddingToCart,
  } = useProductDetailPage(slug, productId)

  const { summary: reviewsSummary } = useProductReviews(slug, productId)
  const questionsTotal = useProductQuestionsCount(slug, productId)
  const { addRecentlyViewed } = useRecentlyViewed()
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'questions'>('specs')

  // Registrar produto visto recentemente
  useEffect(() => {
    if (product) {
      const images = Array.isArray(product.images)
        ? product.images
        : Object.values(product.images as Record<string, string[]>).flat()
      addRecentlyViewed({
        id: product.id,
        name: product.name,
        price: product.final_price?.toString() ?? product.price,
        images,
        storeSlug: slug,
      })
    }
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Suporte a navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentImages && currentImages.length > 1) {
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
  }, [currentImages, previousImage, nextImage])

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
          onRetry={() => router.push(`/loja/${slug}`)}
          retryText="Voltar para a loja"
        />
      </div>
    )
  }

  const isOutOfStock = product.stock === 0
  const canAddToCart = !isOutOfStock && selectedSize && selectedColor && quantity > 0

  // Rating médio das avaliações (ou 0 se não houver)
  const rating = reviewsSummary?.average_rating ?? 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const handleSearchSubmit = (value: string) => {
    router.push(`/loja/${slug}/produtos?search=${encodeURIComponent(value)}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Main Content */}
      <div className="max-w-[1380px] mx-auto px-4 py-4 sm:py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnail Images - Horizontal em mobile, Vertical em desktop */}
            {currentImages && currentImages.length > 1 && (
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                {currentImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative rounded-lg sm:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300 active:border-primary'
                      }`}
                  >
                    <Image
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px]"
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 100px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="w-full sm:flex-1 relative rounded-2xl overflow-hidden order-1 sm:order-2 min-w-0 h-[60vh] sm:h-auto">
              {currentImages && currentImages.length > 0 ? (
                <>
                  <ProductImageZoom
                    src={buildImageUrls(currentImages)[selectedImageIndex]}
                    alt={product.name}
                  />
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
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Product Title */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary break-words flex-1">
                  {product.name}
                </h1>
                <WishlistButton productId={product.id} className="flex-shrink-0 mt-1" />
              </div>
              <ShareButtons />

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
                <span className="text-xs sm:text-sm text-primary/60">
                  {reviewsSummary?.total_reviews
                    ? `(${rating.toFixed(1)}) · ${reviewsSummary.total_reviews} ${reviewsSummary.total_reviews === 1 ? 'avaliação' : 'avaliações'}`
                    : '(Sem avaliações)'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                {formatPrice(product.final_price?.toString() || product.price)}
              </span>
              {/* Se houver desconto, mostrar preço original riscado e badge */}
              {product.discount_price !== null && product.discount_percentage > 0 && (
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
            <p className="hidden sm:block text-primary/60 text-sm sm:text-base leading-relaxed break-words">
              {product.description}
            </p>

            {/* Select Colors */}
            {product.color ? (
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm font-medium text-primary/60">Cor disponível:</span>
                <div className="flex gap-2 sm:gap-3 items-center">
                  <Button
                    onClick={() => selectColor(product.color!)}
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all p-0 active:scale-95 touch-manipulation"
                    style={{ backgroundColor: getColorHex(product.color) }}
                    title={product.color}
                    aria-label={`Selecionar cor ${product.color}`}
                  >
                    {selectedColor === product.color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] ${getColorHex(product.color) === '#FFFFFF' || getColorHex(product.color).toLowerCase() === '#ffffff'
                            ? 'text-primary'
                            : 'text-white'
                            }`}
                        />
                      </div>
                    )}
                    {getColorHex(product.color) === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                    )}
                  </Button>
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
                      const isSelected = selectedColor === trimmedColor

                      return (
                        <Button
                          key={colorIndex}
                          onClick={() => selectColor(trimmedColor)}
                          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all p-0 active:scale-95 touch-manipulation"
                          style={{ backgroundColor: colorValue }}
                          title={trimmedColor}
                          aria-label={`Selecionar cor ${trimmedColor}`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] ${colorValue === '#FFFFFF' || colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === 'white'
                                  ? 'text-primary'
                                  : 'text-white'
                                  }`}
                              />
                            </div>
                          )}
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
              <div className="space-y-2 sm:space-y-3">
                <span className="text-sm font-medium text-primary/60">Tamanhos disponíveis:</span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'tamanho')
                    ?.value.split(',')
                    .map((size, sizeIndex) => {
                      const trimmedSize = size.trim()
                      const isSelected = selectedSize === trimmedSize

                      return (
                        <Button
                          key={sizeIndex}
                          onClick={() => selectSize(trimmedSize)}
                          className={`px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all active:scale-95 touch-manipulation ${isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'bg-[#F0F0F0] text-primary/60 hover:bg-[#c7c6c6] active:bg-[#c7c6c6]'
                            }`}
                        >
                          {trimmedSize}
                        </Button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-0">
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-100 rounded-full shadow-sm w-auto justify-center">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full active:bg-gray-200 touch-manipulation flex items-center justify-center"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4 text-primary" />
                </button>
                <span className="px-3 sm:px-4 py-2 font-medium min-w-[2.5rem] text-center text-primary text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full active:bg-gray-200 touch-manipulation flex items-center justify-center"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4 text-primary" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                id="add-to-cart-button"
                className="flex-1 sm:flex-1 h-12 sm:h-12 text-base sm:text-lg font-medium shadow-sm active:scale-[0.98] transition-transform touch-manipulation"
                onClick={() => {
                  if (product && currentImages && currentImages.length > 0) {
                    const productImage = currentImages[selectedImageIndex] || currentImages[0]
                    triggerAnimation(productImage, 'add-to-cart-button')
                  }
                  addToCart()
                }}
                disabled={!canAddToCart || isAddingToCart}
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                  </>
                )}
              </Button>
            </div>

            {!canAddToCart && !isOutOfStock && (
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2 px-2">
                {!selectedSize && !selectedColor && 'Selecione o tamanho e a cor'}
                {!selectedSize && selectedColor && 'Selecione o tamanho'}
                {selectedSize && !selectedColor && 'Selecione a cor'}
              </p>
            )}

          </div>
        </div>
      </div>

      {/* Abas: Especificações, Avaliações, Perguntas */}
      <div className="bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200">
            {[
              {
                key: 'specs' as const,
                label: 'Especificações',
                show: !!(product.description || product.specifications),
              },
              {
                key: 'reviews' as const,
                label: 'Avaliações',
                badge: reviewsSummary?.total_reviews ?? 0,
                show: true,
              },
              {
                key: 'questions' as const,
                label: 'Perguntas',
                badge: questionsTotal,
                show: true,
              },
            ]
              .filter((t) => t.show)
              .map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === tab.key
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {!!tab.badge && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
          </div>

          {/* Especificações */}
          {activeTab === 'specs' && (
            <div className="py-6 sm:py-10">
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-primary mb-2">Descrição</h2>
                  <p className="text-primary/60 text-sm leading-relaxed break-words">
                    {product.description}
                  </p>
                </div>
              )}
              {product.specifications && (
                <div>
                  {product.description && (
                    <h2 className="text-base font-semibold text-primary mb-2">Especificações</h2>
                  )}
                  <div
                    className="text-primary/60 text-sm leading-relaxed prose prose-sm prose-headings:text-primary/80 prose-p:text-primary/60 prose-ul:text-primary/60 prose-ol:text-primary/60 prose-strong:text-primary/80 break-words max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.specifications }}
                  />
                </div>
              )}
              {!product.description && !product.specifications && (
                <p className="text-sm text-gray-400 py-8 text-center">
                  Nenhuma especificação disponível para este produto.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Avaliações */}
        {activeTab === 'reviews' && (
          <ProductReviews
            slug={slug}
            productId={productId}
            productName={product.name}
          />
        )}

        {/* Perguntas */}
        {activeTab === 'questions' && (
          <ProductQuestions slug={slug} productId={productId} />
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={product?.store?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}/produto/${productId}`}
      />

      {/* Add to Cart Animation */}
      {animationData && (
        <AddToCartAnimation
          imageUrl={animationData.imageUrl}
          startElement={animationData.startElement}
          endElement={animationData.endElement}
          onComplete={onAnimationComplete}
        />
      )}

      {/* Vistos Recentemente */}
      <RecentlyViewedSection currentProductId={product.id} storeSlug={slug} />

      <AppFooter />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
