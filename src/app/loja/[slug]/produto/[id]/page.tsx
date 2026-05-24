'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CartSidebar, ErrorState, StoreHeader, ProductReviews } from '@/components'
import { useProductQuestionsCount } from '@/hooks/useProductQuestions'
import { useProductDetailPage } from './useProductDetailPage'
import { useProductReviews } from '@/hooks/useProductReviews'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation'
import { AddToCartAnimation } from '@/components/Animation/AddToCartAnimation'
import { AppFooter } from '@/components/Layout/AppFooter'
import { RelatedProducts } from '@/components/Product/RelatedProducts'
import { WhatsAppChatWidget } from '@/components/Store/WhatsAppChatWidget'
import { WishlistButton } from '@/components/Product/WishlistButton'
import { ShareButtons } from '@/components/Product/ShareButtons'
import { ProductQuestions } from '@/components/Product/ProductQuestions'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import LoadingPage from '@/components/Layout/LoadingPage'
import { ProductImageGallery } from '@/components/Store/Product/ProductImageGallery'
import { ProductRating } from '@/components/Store/Product/ProductRating'
import { ProductPricing } from '@/components/Store/Product/ProductPricing'
import { ProductColorSelector } from '@/components/Store/Product/ProductColorSelector'
import { ProductSizeSelector } from '@/components/Store/Product/ProductSizeSelector'
import { ProductAddToCart } from '@/components/Store/Product/ProductAddToCart'
import { ProductSpecsTab } from '@/components/Store/Product/ProductSpecsTab'
import { ProductTabBar, TabKey } from '@/components/Store/Product/ProductTabBar'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const productId = params.id as string

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('specs')

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
    currentStock,
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
          onRetry={() => router.refresh()}
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

  const hasColors = !!(
    product.color || product.dynamic_fields?.find((f) => f.field_name.toLowerCase() === 'cor')
  )
  const hasSizes = !!product.dynamic_fields?.find(
    (f) => f.field_name.toLowerCase() === 'tamanho'
  )

  const dynamicColorField = product.dynamic_fields?.find(
    (f) => f.field_name.toLowerCase() === 'cor'
  )
  const dynamicSizeField = product.dynamic_fields?.find(
    (f) => f.field_name.toLowerCase() === 'tamanho'
  )

  const handleSearchSubmit = (value: string) => {
    router.push(`/loja/${slug}/produtos?search=${encodeURIComponent(value)}`)
  }

  const handleAddToCart = () => {
    if (product && currentImages && currentImages.length > 0) {
      const productImage = currentImages[selectedImageIndex] || currentImages[0]
      triggerAnimation(productImage, 'add-to-cart-button')
    }
    addToCart()
  }

  const tabs = [
    {
      key: 'specs' as TabKey,
      label: 'Especificações',
      show: !!(product.description || product.specifications),
    },
    {
      key: 'reviews' as TabKey,
      label: 'Avaliações',
      badge: reviewsSummary?.total_reviews ?? 0,
      show: true,
    },
    {
      key: 'questions' as TabKey,
      label: 'Perguntas',
      badge: questionsTotal,
      show: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="px-4 sm:px-6 lg:px-20 pt-3 pb-1">
        <Breadcrumbs
          items={[
            { label: 'Início', href: `/loja/${slug}` },
            {
              label: product.category?.name || 'Categoria',
              href: product.category?.id
                ? `/loja/${slug}/produtos?category=${product.category.id}`
                : `/loja/${slug}/produtos`,
            },
            { label: product.name },
          ]}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          <ProductImageGallery
            images={currentImages}
            selectedIndex={selectedImageIndex}
            productName={product.name}
            buildImageUrls={buildImageUrls}
            onSelectImage={selectImage}
            onPrevious={previousImage}
            onNext={nextImage}
          />

          <div className="space-y-4 sm:space-y-6 min-w-0">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary break-words flex-1">
                  {product.name}
                </h1>
                <WishlistButton productId={product.id} className="flex-shrink-0 mt-1" />
              </div>
              <ShareButtons />
              <ProductRating
                rating={reviewsSummary?.average_rating ?? 0}
                totalReviews={reviewsSummary?.total_reviews ?? 0}
              />
            </div>

            <ProductPricing
              finalPrice={product.final_price}
              originalPrice={product.price}
              discountPercentage={product.discount_percentage}
            />

            <div className="flex items-center gap-2 text-primary font-integral text-sm sm:text-base">
              <span className="font-integral tracking-wide">Estoque:</span>
              <span>
                {currentStock > 0
                  ? `${currentStock} unidade${currentStock > 1 ? 's' : ''}`
                  : 'Sem estoque'}
              </span>
            </div>

            <p className="hidden sm:block text-primary/60 text-sm sm:text-base leading-relaxed break-words">
              {product.description}
            </p>

            <ProductColorSelector
              singleColor={product.color}
              dynamicColors={!product.color ? dynamicColorField?.value : undefined}
              selectedColor={selectedColor}
              onSelectColor={selectColor}
            />

            {dynamicSizeField && (
              <ProductSizeSelector
                sizes={dynamicSizeField.value}
                selectedSize={selectedSize}
                onSelectSize={selectSize}
              />
            )}

            <ProductAddToCart
              quantity={quantity}
              currentStock={currentStock}
              hasColors={hasColors}
              hasSizes={hasSizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              isAddingToCart={isAddingToCart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="px-4 sm:px-6 lg:px-20">
          <ProductTabBar activeTab={activeTab} tabs={tabs} onSelect={setActiveTab} />

          {activeTab === 'specs' && (
            <ProductSpecsTab
              description={product.description}
              specifications={product.specifications}
            />
          )}
        </div>

        {activeTab === 'reviews' && (
          <ProductReviews slug={slug} productId={productId} productName={product.name} />
        )}

        {activeTab === 'questions' && (
          <ProductQuestions slug={slug} productId={productId} />
        )}
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={product?.store?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}/produto/${productId}`}
      />

      {animationData && (
        <AddToCartAnimation
          imageUrl={animationData.imageUrl}
          startElement={animationData.startElement}
          endElement={animationData.endElement}
          onComplete={onAnimationComplete}
        />
      )}

      <RelatedProducts
        slug={slug}
        currentProductId={product.id}
        categoryId={product.category?.id}
      />

      <AppFooter />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
