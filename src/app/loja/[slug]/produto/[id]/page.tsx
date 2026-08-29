'use client'

import { useState, useRef, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Heart, Share2, Link as LinkIcon, MessageCircle, Check } from 'lucide-react'
import { CartSidebar, ErrorState, StoreHeader, ProductReviews } from '@/components'
import { useProductDetailPage } from './useProductDetailPage'
import { AddToCartAnimation } from '@/components/Animation'
import { RelatedProducts, ProductQuestions } from '@/components/Product'
import { AnnouncementBar, WhatsAppChatWidget, StoreNewFooter } from '@/components/Store'
import { LoadingPage } from '@/components/Layout'
import {
  ProductImageGallery,
  ProductPricing,
  ProductColorSelector,
  ProductSizeSelector,
  ProductAddToCart,
  ProductMobileBuyBar,
  ProductStockLine,
  ProductSubNav,
  ProductFactsCard,
  ProductPaymentLine,
  ProductTrustSeals,
  type SubNavSection,
  ProductDescriptionSection,
  ProductSpecsSection,
  Stars,
} from '@/components/Store/Product'
import { cn } from '@/lib/utils'
import { storeAccentStyle } from '@/lib/storefront'

const NAV_OFFSET = 64 + 48

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const slug = params.slug as string
  const productId = params.id as string

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [barVisible, setBarVisible] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  const {
    product,
    isLoading,
    error,
    refetch,
    productNotFound,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    currentStock,
    currentImages,
    buildImageUrls,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    isAddingToCart,
    storeInfo,
    animationData,
    triggerAnimation,
    onAnimationComplete,
    reviewsSummary,
    questionsTotal,
    isInWishlist,
    toggleWishlist,
    wishlistLoading,
  } = useProductDetailPage(slug, productId)

  // fecha o dropdown de compartilhar ao clicar fora
  useEffect(() => {
    if (!shareOpen) {
      setLinkCopied(false)
      return
    }
    const onClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [shareOpen])

  if (isLoading) {
    return <LoadingPage />
  }

  if (productNotFound) return notFound()

  if (error) {
    return (
      <ErrorState
        fullScreen
        message="Erro ao carregar produto"
        onRetry={() => refetch()}
        retryText="Tentar novamente"
      />
    )
  }

  if (!product) {
    return (
      <ErrorState
        fullScreen
        message="Produto não encontrado"
        onRetry={() => router.push(`/loja/${slug}`)}
        retryText="Voltar para a loja"
      />
    )
  }

  const dynamicColorField = product.dynamic_fields?.find(
    (f) => f.field_name.toLowerCase() === 'cor'
  )
  const dynamicSizeField = product.dynamic_fields?.find(
    (f) => f.field_name.toLowerCase() === 'tamanho'
  )
  const hasColors = !!(product.color || dynamicColorField)
  const hasSizes = !!dynamicSizeField

  // campos descritivos = dynamic_fields que não são as dimensões de variação
  const descriptiveFields = (product.dynamic_fields ?? []).filter((f) => {
    const name = f.field_name.toLowerCase()
    return name !== 'cor' && name !== 'tamanho'
  })

  // estoque por tamanho considerando a cor ativa (para riscar pills esgotadas)
  const variantStocks = product.variant_stocks ?? []
  const stockForSize = (size: string): number | null => {
    if (variantStocks.length === 0) return null
    const match = variantStocks.find(
      (v) => (!v.color || v.color === selectedColor) && v.size === size,
    )
    return match ? match.stock : 0
  }
  const colorTotal =
    selectedColor && variantStocks.length > 0
      ? variantStocks
          .filter((v) => v.color === selectedColor)
          .reduce((sum, v) => sum + v.stock, 0)
      : null

  const favorited = isInWishlist(product.id)
  const averageRating = reviewsSummary?.average_rating ?? 0
  const totalReviews = reviewsSummary?.total_reviews ?? 0

  const sections: SubNavSection[] = [
    { id: 'descricao', label: 'Descrição' },
    // a seção só renderiza quando há specifications — o link acompanha
    ...(product.specifications ? [{ id: 'especificacoes', label: 'Especificações' }] : []),
    { id: 'avaliacoes', label: 'Avaliações', count: totalReviews || null },
    { id: 'perguntas', label: 'Perguntas', count: questionsTotal || null },
  ]

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
      behavior: 'smooth',
    })
  }

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

  // window.location.origin é leitura aceitável (domínio não varia por rota);
  // pathname vem de usePathname() para evitar window.location.pathname/href
  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}`
    : `${process.env.NEXT_PUBLIC_APP_URL}${pathname}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setLinkCopied(true)
      setTimeout(() => {
        setLinkCopied(false)
        setShareOpen(false)
      }, 1800)
    } catch {
      // clipboard indisponível — ignora
    }
  }

  const handleWhatsAppShare = () => {
    setShareOpen(false)
    const url = encodeURIComponent(`Veja este produto: ${productUrl}`)
    window.open(`https://wa.me/?text=${url}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-white" style={storeAccentStyle(storeInfo)}>
      {barVisible && <AnnouncementBar storeInfo={storeInfo} onDismiss={() => setBarVisible(false)} />}

      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      <ProductSubNav sections={sections} storeHref={`/loja/${slug}`} />

      <main className="mx-auto w-full max-w-store px-4 md:px-10">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 pt-5 text-[11px] font-medium text-nxi3">
          <button
            onClick={() => router.push(`/loja/${slug}`)}
            className="rounded hover:text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store"
          >
            Início
          </button>
          <span>›</span>
          <button
            onClick={() =>
              router.push(
                product.category?.id
                  ? `/loja/${slug}/produtos?category=${product.category.id}`
                  : `/loja/${slug}/produtos`,
              )
            }
            className="rounded hover:text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store"
          >
            {product.category?.name || 'Produtos'}
          </button>
          <span>›</span>
          <span className="truncate text-nxi2">{product.name}</span>
        </nav>

        {/* gallery + sticky buy box */}
        <div className="grid grid-cols-1 gap-8 pb-12 pt-5 lg:grid-cols-[1fr_400px] lg:gap-14">
          <ProductImageGallery
            images={currentImages}
            productName={product.name}
            discountPercentage={product.discount_percentage}
            buildImageUrls={buildImageUrls}
            galleryKey={selectedColor ?? 'default'}
          />

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-store-ink">
              {product.category?.name}
            </span>
            <h1 className="mt-1.5 break-words text-[32px] font-bold text-nxi1 sm:text-[28px]">
              {product.name}
            </h1>

            <button
              onClick={() => jumpTo('avaliacoes')}
              className="mt-2.5 flex items-center gap-2 rounded text-[12.5px] text-nxi3 transition-colors hover:text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store"
            >
              {totalReviews > 0 && <Stars rating={averageRating} size={14} />}
              <span className="font-medium underline-offset-2 hover:underline">
                {totalReviews
                  ? `${averageRating.toFixed(1)} · ${totalReviews} ${totalReviews === 1 ? 'avaliação' : 'avaliações'}`
                  : 'Sem avaliações ainda'}
              </span>
            </button>

            <div className="mt-5">
              <ProductPricing
                finalPrice={product.final_price}
                originalPrice={product.price}
                discountPercentage={product.discount_percentage}
              />
              <ProductPaymentLine storeInfo={storeInfo} />
            </div>

            {product.description && (
              <p className="mt-3 line-clamp-2 max-w-[46ch] break-words text-[13.5px] leading-relaxed text-nxi2">
                {product.description}
              </p>
            )}

            <ProductFactsCard fields={descriptiveFields} />

            <ProductColorSelector
              singleColor={!dynamicColorField ? product.color : undefined}
              dynamicColors={dynamicColorField?.value}
              selectedColor={selectedColor}
              onSelectColor={selectColor}
            />

            {dynamicSizeField && (
              <ProductSizeSelector
                sizes={dynamicSizeField.value}
                selectedSize={selectedSize}
                onSelectSize={selectSize}
                stockForSize={stockForSize}
              />
            )}

            <ProductStockLine
              currentStock={currentStock}
              hasSizes={hasSizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              colorTotal={colorTotal}
            />

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

            {/* favoritar + compartilhar */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                disabled={wishlistLoading}
                className={cn(
                  'flex h-10 flex-1 items-center justify-center gap-2 rounded-full border text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-60',
                  favorited
                    ? 'border-nxd/30 bg-nxd/[0.06] text-nxd'
                    : 'border-nxborder text-nxi2 hover:border-nxi3',
                )}
              >
                <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
                {favorited ? 'Favoritado' : 'Favoritar'}
              </button>
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShareOpen((o) => !o)}
                  className="flex h-10 items-center justify-center gap-2 rounded-full border border-nxborder px-4 text-[12.5px] font-semibold text-nxi2 transition-colors hover:border-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
                >
                  <Share2 size={15} /> Compartilhar
                </button>
                {shareOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-nxborder bg-white p-1.5 shadow-xl">
                    {linkCopied ? (
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-bold text-nxs">
                        <Check size={14} strokeWidth={2.6} /> Copiado!
                      </div>
                    ) : (
                      <button
                        onClick={handleCopyLink}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium text-nxi2 hover:bg-nxbg"
                      >
                        <LinkIcon size={14} /> Copiar link
                      </button>
                    )}
                    <button
                      onClick={handleWhatsAppShare}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium text-nxi2 hover:bg-nxbg"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

            <ProductTrustSeals storeInfo={storeInfo} />
          </aside>
        </div>

        {/* seções contínuas — dynamic_fields/categoria vivem só na ficha do buy box */}
        <ProductDescriptionSection description={product.description} />

        <ProductSpecsSection specifications={product.specifications} />

        <section id="avaliacoes" className="border-t border-nxborder">
          <ProductReviews slug={slug} productId={productId} productName={product.name} storeInfo={storeInfo} />
        </section>

        <section id="perguntas" className="border-t border-nxborder">
          <ProductQuestions slug={slug} productId={productId} />
        </section>

        <RelatedProducts
          slug={slug}
          currentProductId={product.id}
          categoryId={product.category?.id}
        />
      </main>

      {storeInfo && <StoreNewFooter storeInfo={storeInfo} slug={slug} />}

      <ProductMobileBuyBar
        finalPrice={product.final_price}
        originalPrice={product.price}
        hasDiscount={product.discount_percentage > 0}
        currentStock={currentStock}
        hasColors={hasColors}
        hasSizes={hasSizes}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        isAddingToCart={isAddingToCart}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onAddToCart={handleAddToCart}
      />

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

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} liftedOnMobile />
    </div>
  )
}
