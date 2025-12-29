'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductCard, StorePagination, StoreSidebar, LoadingSpinner, ErrorState, CartSidebar, StoreHeader } from '@/components'
import { Star, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStorePage } from './useStorePage'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useCart } from '@/hooks/useCart'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const {
    // Estado
    search,
    sort,
    sortField,
    filters,

    // Dados da API
    products,
    loading,
    error,
    meta,

    // Dados processados
    categories,
    availableColors,
    availableSizes,

    // Handlers
    handleSearch,
    handleSearchSubmit,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleAddToFavorites,
    handleViewDetails
  } = useStorePage({ slug })

  // Hook para buscar informações da loja
  const { storeInfo } = useStoreInfo(slug)

  // Hook do carrinho
  const { totalItems } = useCart(storeInfo?.id)

  // Função para determinar o título da página
  const getPageTitle = () => {
    if (filters.categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === filters.categoryId)
      return selectedCategory ? selectedCategory.name : 'Todos os produtos'
    }
    return 'Todos os produtos'
  }

  if (loading && !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header da Loja */}
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={search}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="flex gap-6 p-0">
        {/* Sidebar de Filtros */}

        {/* Conteúdo Principal */}
        <div className="flex-1">
          <div className="max-w-7xl 2xl:max-w-screen-2xl flex gap-10 mx-auto py-8">

            <div className="w-72">
              <StoreSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSearch={handleSearch}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                searchValue={search}
                sortValue={sort}
                sortFieldValue={sortField}
                activeFilters={filters}
                categories={categories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                storeId={storeInfo?.id || null}
              />
            </div>

            <div className="flex-1">
              {/* Título */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">
                    {getPageTitle()}
                  </h2>
                  <p className="text-gray-600">
                    {meta?.total || 0} produtos encontrados
                  </p>
                </div>


              </div>

              {/* Informações dos Produtos */}
              <div className="flex items-center gap-4 mb-6">
                {filters.featured && (
                  <Badge className="bg-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Em destaque
                  </Badge>
                )}
              </div>

              {/* Grid de Produtos */}
              {products.length > 0 ? (
                <>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToFavorites={handleAddToFavorites}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>

                  {/* Paginação */}
                  {meta && meta.lastPage > 1 && (
                    <StorePagination
                      currentPage={meta.currentPage}
                      totalPages={meta.lastPage}
                      totalItems={meta.total}
                      onPageChange={handlePageChange}
                      hasNextPage={meta.next !== null}
                      hasPrevPage={meta.prev !== null}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Package className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os filtros ou termo de busca
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
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
