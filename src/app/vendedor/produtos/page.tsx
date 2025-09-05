'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, LoadingSpinner, ErrorState, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis, ProductFilters, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components'
import {
  Package,
  Plus,
  Star,
  ArrowLeft,
  LogOut,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'
import { useProdutosPage } from './useProdutosPage'

export default function ProdutosPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    filters,
    setFilters,
    products,
    meta,
    availableSizes,
    availableColors,
    stats,
    formatPrice,
    isLoading,
    error,
    handlePageChange,
    handleLimitChange,
    isSearching,
    handleToggleStatus,
    isUpdatingStatus
  } = useProdutosPage()

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user || user.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return <LoadingSpinner message="Carregando produtos..." />
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
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm justify-center">
        <div className="pr-4 sm:pr-6 lg:pr-10 lg:pl-2">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/vendedor')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => router.push('/vendedor/produtos/criar')}
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>
              <Button
                variant="ghost"
                onClick={logout}

              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto">
        <div className="p-6">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            availableSizes={availableSizes}
            availableColors={availableColors}
            isSearching={isSearching}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-96">
        <div className="py-6 px-20">
          {/* Page Title */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Meus Produtos
            </h1>
            <p className="text-lg text-gray-600">
              {stats.total} produtos encontrados
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="px-4 sm:px-6 lg:px-8 mb-8">
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

          {/* Products */}
          <div className="px-4 sm:px-6 lg:px-8">
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
                  className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                  onClick={() => router.push('/vendedor/produtos/criar')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Produto
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/vendedor/produtos/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-50">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={buildImageUrl(product.images[0])}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-gray-300" />
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-xl">
                        {product.name}
                      </h3>
                      <p className="text-base text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-600">
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {product.status === 1 ? 'Disponível' : 'Esgotado'}
                          </span>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={product.status === 1}
                              onCheckedChange={(checked: boolean) => {
                                handleToggleStatus(product.id, product.status)
                              }}
                              disabled={isUpdatingStatus}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Mostrando {((meta.currentPage - 1) * meta.perPage) + 1} a {Math.min(meta.currentPage * meta.perPage, meta.total)} de {meta.total} produtos
                  </span>
                  <Select
                    value={filters.limit.toString()}
                    onValueChange={(value) => handleLimitChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
            )}
          </div>
        </div>
      </div>

    </div>
  )
}