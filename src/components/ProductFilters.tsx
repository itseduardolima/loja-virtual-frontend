'use client'

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import { Search, Filter } from 'lucide-react'

interface ProductFiltersProps {
  filters: {
    search: string
    sort: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
    category_id?: number
    min_price?: number
    max_price?: number
    size: string
    color: string
    status?: number
    featured?: boolean
  }
  setFilters: (filters: any) => void
  availableSizes: string[]
  availableColors: string[]
  isSearching?: boolean
}

export function ProductFilters({ 
  filters, 
  setFilters, 
  availableSizes, 
  availableColors,
  isSearching = false
}: ProductFiltersProps) {
  return (
    <div className='pt-6'>
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Buscar</label>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={filters.search}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ordenar por</label>
          <Select
            value={filters.sort}
            onValueChange={(value: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest') => 
              setFilters((prev: any) => ({ ...prev, sort: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="name_asc">Nome A-Z</SelectItem>
              <SelectItem value="name_desc">Nome Z-A</SelectItem>
              <SelectItem value="price_asc">Menor Preço</SelectItem>
              <SelectItem value="price_desc">Maior Preço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            value={filters.status?.toString() || 'all'}
            onValueChange={(value: string) => 
              setFilters((prev: any) => ({ ...prev, status: value === 'all' ? undefined : parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="1">Ativo</SelectItem>
              <SelectItem value="0">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Destaque</label>
          <Select
            value={filters.featured === undefined ? 'all' : filters.featured.toString()}
            onValueChange={(value: string) => 
              setFilters((prev: any) => ({ ...prev, featured: value === 'all' ? undefined : value === 'true' }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Destaque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Em Destaque</SelectItem>
              <SelectItem value="false">Não Destacados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Faixa de Preço</label>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="number"
                placeholder="Preço mínimo"
                value={filters.min_price || ''}
                onChange={(e) => 
                  setFilters((prev: any) => ({ 
                    ...prev, 
                    min_price: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))
                }
                className={isSearching ? 'pr-10' : ''}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Preço máximo"
                value={filters.max_price || ''}
                onChange={(e) => 
                  setFilters((prev: any) => ({ 
                    ...prev, 
                    max_price: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))
                }
                className={isSearching ? 'pr-10' : ''}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tamanho</label>
          <Select
            value={filters.size || 'all'}
            onValueChange={(value: string) => 
              setFilters((prev: any) => ({ ...prev, size: value === 'all' ? '' : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tamanhos</SelectItem>
              {availableSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cor</label>
          <Select
            value={filters.color || 'all'}
            onValueChange={(value: string) => 
              setFilters((prev: any) => ({ ...prev, color: value === 'all' ? '' : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar cor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cores</SelectItem>
              {availableColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
