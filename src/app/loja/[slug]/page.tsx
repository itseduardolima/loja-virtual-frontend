'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {  ProductCard, StorePagination, StoreSidebar, LoadingSpinner, ErrorState, CartSidebar } from '@/components'
import { ShoppingBag, Heart, Star, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStorePage } from './useStorePage'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useCart } from '@/hooks/useCart'
import { buildImageUrl } from '@/lib/imageUtils'
import Image from 'next/image'

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
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleAddToFavorites,
    handleViewDetails
  } = useStorePage({ slug })

  // Hook para buscar informações da loja
  const { storeInfo, loading: storeInfoLoading } = useStoreInfo(slug)
  
  // Hook do carrinho
  const { totalItems } = useCart(storeInfo?.id)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header da Loja */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo da Loja */}
              {storeInfo?.logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={buildImageUrl(storeInfo.logo)}
                    alt={`Logo ${storeInfo.name}`}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              {/* Informações da Loja */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {storeInfo?.name || products[0]?.store?.name || 'Loja'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {storeInfo?.description || `${meta?.total || 0} produtos disponíveis`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoritos
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  console.log('Botão carrinho clicado, abrindo sidebar')
                  setIsCartOpen(true)
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                Carrinho ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-0">
        {/* Sidebar de Filtros */}
        <div className="w-96 flex-shrink-0">
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
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Informações dos Produtos */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {filters.featured && (
                  <Badge className="bg-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Em destaque
                  </Badge>
                )}
              </div>
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
                    itemsPerPage={meta.perPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
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

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
      />
    </div>
  )
}
