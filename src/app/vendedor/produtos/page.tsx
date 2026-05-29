'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, ErrorState, StorePagination, ProductCard } from '@/components'
import { SearchInput } from '@/components/ui/search-input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Package,
  Plus,
  Star,
  TrendingUp,
  MoreVertical,
  Pencil,
  Copy,
  Eye,
  EyeOff,
  LucideIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useProdutosPage } from './useProdutosPage'
import LoadingPage from '@/components/Layout/LoadingPage'

const menuItemClass = 'w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50'

interface StatCardProps {
  value: number
  label: string[]
  bgColor: string
  borderColor: string
  textColor: string
  icon: LucideIcon
}

function StatCard({ value, label, bgColor, borderColor, textColor, icon: Icon }: StatCardProps) {
  return (
    <Card className={`${bgColor} ${borderColor} border-2 transition-shadow`}>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
            <p className={`text-4xl sm:text-5xl lg:text-7xl font-bold ${textColor} leading-none`}>
              {value}
            </p>
            <div className="flex flex-col min-w-0">
              {label.map((line, i) => (
                <p key={i} className={`text-xs sm:text-sm font-bold ${textColor} leading-tight`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${textColor} flex-shrink-0`} />
        </div>
      </CardContent>
    </Card>
  )
}

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
    isUpdatingStatus,
    handleDuplicate,
    isDuplicating
  } = useProdutosPage()

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        onRetry={() => router.refresh()}
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
          {statsCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* Busca + Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        {/* Campo de Busca */}
        <SearchInput
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
          placeholder="Buscar produtos..."
          isLoading={isSearching}
          className="w-full sm:max-w-xs"
        />

        {/* Filtros */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Select
            value={filters.status === undefined ? 'all' : String(filters.status)}
            onValueChange={(v) => setFilters(prev => ({ ...prev, status: v === 'all' ? undefined : Number(v), page: 1 }))}
          >
            <SelectTrigger className="h-9 text-sm w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="1">Ativo</SelectItem>
              <SelectItem value="0">Inativo</SelectItem>
              <SelectItem value="2">Rascunho</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.featured ? 'featured' : filters.sort}
            onValueChange={(v) => {
              if (v === 'featured') {
                setFilters(prev => ({ ...prev, featured: true, page: 1 }))
              } else {
                setFilters(prev => ({ ...prev, sort: v, featured: undefined, page: 1 }))
              }
            }}
          >
            <SelectTrigger className="h-9 text-sm w-40">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
              <SelectItem value="price_asc">Menor preço</SelectItem>
              <SelectItem value="price_desc">Maior preço</SelectItem>
              <SelectItem value="featured">Em destaque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products */}
      <div>
        {products.length > 0 ? (
          <div ref={menuRef} className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="relative h-full">
                <ProductCard
                  product={product}
                  onAddToFavorites={() => {}}
                  onViewDetails={() => router.push(`/vendedor/produtos/${product.id}`)}
                  showFavorites={false}
                  showStatusSwitch={false}
                />

                {/* Badge rascunho */}
                {product.status === 2 && (
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <Badge className="bg-gray-100 text-gray-600 border border-gray-300 rounded-full text-xs font-semibold px-2 py-0.5">
                      Rascunho
                    </Badge>
                  </div>
                )}

                {/* Botão 3 pontos */}
                <div
                  className="absolute top-2 right-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:bg-white transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>

                  {openMenuId === product.id && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30">
                      <button
                        type="button"
                        onClick={() => { setOpenMenuId(null); router.push(`/vendedor/produtos/editar/${product.id}`) }}
                        className={`${menuItemClass} text-gray-700`}
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-500" />
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={isDuplicating}
                        onClick={() => { setOpenMenuId(null); handleDuplicate(product.id) }}
                        className={`${menuItemClass} text-gray-700`}
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                        Duplicar
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => { setOpenMenuId(null); handleToggleStatus(product.id, product.status) }}
                        className={menuItemClass}
                      >
                        {product.status === 1 ? (
                          <><EyeOff className="h-3.5 w-3.5 text-red-400" /><span className="text-red-500">Desativar</span></>
                        ) : (
                          <><Eye className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600">Ativar</span></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
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