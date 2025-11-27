'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductCard, StorePagination, StoreSidebar, LoadingSpinner, ErrorState, CartSidebar } from '@/components'
import { ShoppingBag, Star, Package, Search, User, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useStorePage } from './useStorePage'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { buildImageUrl } from '@/lib/imageUtils'
import Image from 'next/image'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

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
    handleItemsPerPageChange,
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
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="mx-auto py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Informações da Loja */}
              <div>
                <h1 className="text-3xl uppercase font-integral text-primary">
                  {storeInfo?.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center">
              {/* Campo de Busca */}
              <div className="relative w-[577px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(search)
                    }
                  }}
                  className="pl-10 pr-4 py-3 bg-[#F0F0F0]  rounded-full"
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCartOpen(true)
                }}
                className="relative"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <Badge
                    className="absolute top-1 right-1 h-5 min-w-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs  rounded-full border-0"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Botão de Usuário */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2"
                >
                  <User className="w-6 h-6" />
                  {isAuthenticated && user && (
                    <span className="text-sm font-medium">{user.name}</span>
                  )}
                </Button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      {isAuthenticated && user ? (
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 rounded"
                            onClick={() => {
                              router.push('/login')
                              setIsUserMenuOpen(false)
                            }}
                          >
                            <LogIn className="w-4 h-4" />
                            Fazer Login
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 rounded"
                            onClick={() => {
                              router.push('/register')
                              setIsUserMenuOpen(false)
                            }}
                          >
                            <UserPlus className="w-4 h-4" />
                            Criar Conta
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
