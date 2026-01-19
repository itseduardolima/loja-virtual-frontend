'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProductCard, StorePagination, StoreSidebar, ErrorState, CartSidebar, StoreHeader, LoadingPage } from '@/components'
import { Star, Package, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStorePage } from './useStorePage'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useCart } from '@/hooks/useCart'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
      // Em desktop, sidebar sempre aberta por padrão
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header da Loja */}
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={search}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Mobile Filter Button */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="outline"
              className="flex-1 justify-center gap-2 h-10"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            {(filters.categoryId || filters.color || filters.size || filters.featured || filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {Object.values(filters).filter(v => v !== undefined && v !== false).length} ativo(s)
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-0 lg:gap-6">
        {/* Sidebar de Filtros - Desktop (sempre visível) / Mobile (drawer) */}
        {isMobile ? (
          <>
            {/* Overlay para mobile */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            {/* Drawer para mobile */}
            <div
              className={`
                fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              {/* Header do Drawer */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8 p-0"
                  aria-label="Fechar filtros"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Conteúdo do Drawer - Scrollável */}
              <div className="flex-1 overflow-y-auto">
                <StoreSidebar
                  isOpen={true}
                  onClose={() => setIsSidebarOpen(false)}
                  onSearch={handleSearch}
                  onSortChange={(sort, sortField) => {
                    handleSortChange(sort, sortField)
                  }}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters)
                  }}
                  onClearFilters={() => {
                    handleClearFilters()
                  }}
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
            </div>
          </>
        ) : (
          /* Desktop Sidebar */
          <aside className="hidden lg:block w-full max-w-xs flex-shrink-0 pl-4 xl:pl-4">
            <div className="relative top-8">
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
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingPage />
              </div>
            ) : (
              <>
                {/* Título e Contadores */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {getPageTitle()}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600">
                        {meta?.total || products?.length || 0} {(meta?.total || products?.length || 0) === 1 ? 'produto encontrado' : 'produtos encontrados'}
                      </p>
                    </div>
                  </div>

                  {/* Badges de Filtros Ativos */}
                  <div className="flex flex-wrap items-center gap-2">
                    {filters.featured && (
                      <Badge className="bg-pink-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Em destaque
                      </Badge>
                    )}
                    {filters.categoryId && categories.find(c => c.id === filters.categoryId) && (
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.id === filters.categoryId)?.name}
                      </Badge>
                    )}
                    {filters.color && (
                      <Badge variant="secondary" className="text-xs">
                        Cor: {filters.color}
                      </Badge>
                    )}
                    {filters.size && (
                      <Badge variant="secondary" className="text-xs">
                        Tamanho: {filters.size}
                      </Badge>
                    )}
                    {(filters.categoryId || filters.color || filters.size || filters.featured || filters.minPrice || filters.maxPrice) && (
                      <Button
                        onClick={handleClearFilters}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-gray-600 hover:text-gray-900"
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </div>

                {/* Grid de Produtos */}
                  {products && Array.isArray(products) && products.length > 0 ? (
                    <>
                      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
                        <div className="mt-6 sm:mt-8">
                          <StorePagination
                            currentPage={meta.currentPage}
                            totalPages={meta.lastPage}
                            totalItems={meta.total}
                            onPageChange={handlePageChange}
                            hasNextPage={meta.next !== null}
                            hasPrevPage={meta.prev !== null}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 sm:py-12 px-4">
                      <div className="text-gray-400 mb-4">
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        Nenhum produto encontrado
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        Tente ajustar os filtros ou termo de busca
                      </p>
                      <Button onClick={handleClearFilters} variant="outline" className="w-full sm:w-auto">
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </>
              )}
          </div>
        </main>
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
