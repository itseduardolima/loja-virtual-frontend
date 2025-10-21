'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, LoadingSpinner, ErrorState, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis, StoreSidebar, Switch, ProductCard } from '@/components'
import { Input } from '@/components/ui/input'
import {
  Package,
  Plus,
  Star,
  TrendingUp,
  BarChart3,
  Search
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProdutosPage } from './useProdutosPage'
import LoadingPage from '@/components/LoadingPage'

export default function ProdutosPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    filters,
    setFilters,
    products,
    meta,
    stats,
    isLoading,
    error,
    handlePageChange,
    isSearching,
    handleToggleStatus,
    isUpdatingStatus
  } = useProdutosPage()

  if (authLoading) {
    return <LoadingPage />
  }

  if (!user || user.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorState
        message="Erro ao carregar produtos"
        onRetry={() => window.location.reload()}
        retryText="Tentar novamente"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-8">

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Meus Produtos
              </h1>
              <p className="text-lg text-gray-600">
                {stats.total} produtos encontrados
              </p>
            </div>



            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => router.push('/vendedor/produtos/criar')}
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>

            </div>

          </div>
        </div>


        {/* Statistics Cards */}
        <div className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Produtos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Produtos Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Em Destaque</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Estoque Total</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalStock}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="relative max-w-md w-full mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            className="pl-10 pr-4 py-3"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Products */}
        <div >
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="p-4 bg-gray-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {filters.search || filters.status || filters.featured ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filters.search || filters.status || filters.featured ? 'Tente ajustar os filtros de busca para encontrar o que procura' : 'Comece criando seu primeiro produto para começar a vender'}
              </p>
              <Button

                onClick={() => router.push('/vendedor/produtos/criar')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Produto
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="relative group h-full">
                  <ProductCard
                    product={product}
                    onAddToFavorites={() => { }} // Função vazia para vendedor
                    onViewDetails={() => router.push(`/vendedor/produtos/${product.id}`)}
                    showFavorites={false}
                    showStatusSwitch={true}
                    onStatusChange={handleToggleStatus}
                    isUpdatingStatus={isUpdatingStatus}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="mt-12">
              {/* Pagination Navigation - Centered */}
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (meta.currentPage > 1) {
                            handlePageChange(meta.currentPage - 1)
                          }
                        }}
                        className={meta.currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>

                    {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === meta.lastPage ||
                        (page >= meta.currentPage - 1 && page <= meta.currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(page)
                              }}
                              isActive={page === meta.currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (
                        page === meta.currentPage - 2 ||
                        page === meta.currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }
                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (meta.currentPage < meta.lastPage) {
                            handlePageChange(meta.currentPage + 1)
                          }
                        }}
                        className={meta.currentPage >= meta.lastPage ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}