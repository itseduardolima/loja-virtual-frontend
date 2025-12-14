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
      value: stats.totalStock,
      label: ['Estoque', 'Total'],
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-700',
      icon: BarChart3
    }
  ]

  return (

    <div className="max-w-7xl mx-auto py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meus Produtos
            </h1>
            <p className="text-gray-600">
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
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card 
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <p className={`text-7xl font-bold ${card.textColor}`}>{card.value}</p>
                      <div className="flex flex-col">
                        {card.label.map((line, lineIndex) => (
                          <p 
                            key={lineIndex}
                            className={`text-sm font-bold ${card.textColor}`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${card.textColor}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
      <div>
        {products.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status || filters.featured ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status || filters.featured ? 'Tente ajustar os filtros de busca para encontrar o que procura' : 'Comece criando seu primeiro produto para começar a vender'}
            </p>
            <Button
              onClick={() => router.push('/vendedor/produtos/criar')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Produto
            </Button>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-12">
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