'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, ErrorState, StorePagination, StoreSidebar, Switch, ProductCard } from '@/components'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import LoadingPage from '@/components/Layout/LoadingPage'

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

  const statsCards = [
    {
      value: stats.total,
      label: ['Total de', 'Produtos'],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      icon: Package
    },
    {
      value: stats.active,
      label: ['Produtos', 'Ativos'],
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      icon: TrendingUp
    },
    {
      value: stats.featured,
      label: ['Em', 'Destaque'],
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      icon: Star
    },
    {
      value: stats.inactive,
      label: ['Produtos', 'Esgotados'],
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      icon: Package
    }
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Page Title */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Meus Produtos
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {stats.total} produtos encontrados
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => router.push('/vendedor/produtos/criar')}
              size="sm"
              className="text-sm w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Novo Produto</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card 
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 transition-shadow`}
              >
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                      <p className={`text-4xl sm:text-5xl lg:text-7xl font-bold ${card.textColor} leading-none`}>
                        {card.value}
                      </p>
                      <div className="flex flex-col min-w-0">
                        {card.label.map((line, lineIndex) => (
                          <p 
                            key={lineIndex}
                            className={`text-xs sm:text-sm font-bold ${card.textColor} leading-tight`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${card.textColor} flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="relative w-full sm:max-w-md mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
          className="pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-t-transparent border-gray-400"></div>
          </div>
        )}
      </div>

      {/* Products */}
      <div>
        {products.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        ) : (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-gray-400 mb-3 sm:mb-4">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status || filters.featured ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              {filters.search || filters.status || filters.featured ? 'Tente ajustar os filtros de busca para encontrar o que procura' : 'Comece criando seu primeiro produto para começar a vender'}
            </p>
            <Button
              onClick={() => router.push('/vendedor/produtos/criar')}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Criar Produto
            </Button>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-6 sm:mt-8 lg:mt-12">
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
      </div>
    </div>


  )
}