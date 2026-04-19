'use client'

import { useParams } from 'next/navigation'
import {
  ProductCard,
  StoreHeader,
  CartSidebar,
  ErrorState,
  LoadingPage,
  StoreCategorySection,
} from '@/components'
import { useStoreHomePage } from './useStoreHomePage'
import { buildImageUrl } from '@/lib/utils'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStoreReviews } from '@/hooks/useStoreReviews'
import { StoreReviewsCarousel } from '@/components/Store/StoreReviewsCarousel'
import { AppFooter } from '@/components/Layout/AppFooter'
import { WhatsAppChatWidget } from '@/components/Store/WhatsAppChatWidget'

export default function StoreHomePage() {
  const params = useParams()
  const slug = params.slug as string

  const {
    storeInfo,
    storeError,
    categoriesToShow,
    products,
    featuredProducts,
    topRatedProducts,
    loading,
    productsLoading,
    hasCategorySections,
    search,
    setSearch,
    isCartOpen,
    setIsCartOpen,
    handleViewDetails,
    handleAddToFavorites,
    handleSearchSubmit,
  } = useStoreHomePage(slug)

  const {
    reviews: storeReviews,
    isLoading: storeReviewsLoading,
  } = useStoreReviews(slug, 20, 4)

  if (storeError && !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={storeError} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }


  return (
    <div className="min-h-screen">
      <StoreHeader
        storeInfo={storeInfo ?? undefined}
        slug={slug}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      {storeInfo?.banner && (
        <div className="w-full h-full relative mx-auto px-4 sm:px-6 lg:px-20">
          <img
            src={buildImageUrl(storeInfo.banner)}
            alt={`Banner ${storeInfo.name}`}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-20 py-6 lg:py-8">
        {loading && !hasCategorySections ? (
          <div className="flex items-center justify-center py-16">
            <LoadingPage />
          </div>
        ) : hasCategorySections ? (
          <>
            {!search && featuredProducts.length > 0 && (
              <StoreCategorySection
                key="featured"
                slug={slug}
                category={{ id: 0, name: 'Em Destaque', description: '', _count: { products: featuredProducts.length } }}
                products={featuredProducts}
                onViewDetails={handleViewDetails}
                onAddToFavorites={handleAddToFavorites}
              />
            )}
            {!search && topRatedProducts.length > 0 && (
              <StoreCategorySection
                key="top-rated"
                slug={slug}
                category={{ id: -1, name: 'Mais Avaliados', description: '', _count: { products: topRatedProducts.length } }}
                products={topRatedProducts}
                onViewDetails={handleViewDetails}
                onAddToFavorites={handleAddToFavorites}
              />
            )}
            {categoriesToShow.map((category) => (
              <StoreCategorySection
                key={category.id}
                slug={slug}
                category={category}
                onViewDetails={handleViewDetails}
                onAddToFavorites={handleAddToFavorites}
              />
            ))}
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Produtos</h1>
              <p className="text-gray-600 mt-1">
                {productsLoading ? '...' : `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`}
              </p>
            </div>
            {productsLoading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingPage />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToFavorites={handleAddToFavorites}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <Package className="w-9 h-9 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {search ? 'Nenhum resultado encontrado' : 'Em breve, novidades!'}
                </h2>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  {search
                    ? `Não encontramos produtos para "${search}". Tente outro termo.`
                    : 'Esta loja está preparando seus produtos. Volte em breve para conferir!'}
                </p>
                {search && (
                  <Button variant="outline" className="mt-5" onClick={() => setSearch('')}>
                    Ver todos os produtos
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {storeReviewsLoading ? null : storeReviews.length > 0 ? (
        <section>
          <div className="mx-auto px-4 sm:px-6 lg:px-20 py-10 lg:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-integral text-center">
              Nossos clientes satisfeitos
            </h2>
            <StoreReviewsCarousel reviews={storeReviews} />
          </div>
        </section>
      ) : null}

      <AppFooter />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}`}
      />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}