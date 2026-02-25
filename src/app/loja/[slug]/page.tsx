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

export default function StoreHomePage() {
  const params = useParams()
  const slug = params.slug as string

  const {
    storeInfo,
    storeError,
    categoriesToShow,
    products,
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
              <div className="text-center py-12 sm:py-16 px-4">
                <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h2>
                <p className="text-gray-600 mb-4">
                  {search ? 'Tente outro termo de busca.' : 'Esta loja ainda não tem produtos.'}
                </p>
                {search && (
                  <Button variant="outline" onClick={() => setSearch('')}>
                    Limpar busca
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
    </div>
  )
}