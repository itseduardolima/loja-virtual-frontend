'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Filter } from 'lucide-react'
import { StoreFiltersProps } from '@/app/loja/[slug]/types'

interface StoreSidebarProps extends StoreFiltersProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  variant?: 'sidebar' | 'inline'
  showSearch?: boolean
}

export function StoreSidebar({
  isOpen,
  onClose,
  className = '',
  variant = 'sidebar',
  showSearch = false,
  ...filterProps
}: StoreSidebarProps) {
  if (!isOpen) return null

  const isInline = variant === 'inline'

  if (isInline) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Barra de Busca e Ordenação */}
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={filterProps.searchValue}
                onChange={(e) => filterProps.onSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={`${filterProps.sortFieldValue}-${filterProps.sortValue}`}
                onValueChange={(value) => {
                  const [field, order] = value.split('-')
                  filterProps.onSortChange(order, field)
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-DESC">Mais recentes</SelectItem>
                  <SelectItem value="created_at-ASC">Mais antigos</SelectItem>
                  <SelectItem value="price-DESC">Maiores preços</SelectItem>
                  <SelectItem value="price-ASC">Menores preços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Filtros Inline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Produtos em Destaque */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Produtos em Destaque</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filterProps.activeFilters.featured || false}
                onCheckedChange={(checked) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  featured: checked
                })}
              />
              <Label className="text-sm text-gray-600">Mostrar apenas produtos em destaque</Label>
            </div>
          </div>

          {/* Categoria */}
          {filterProps.categories.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Categoria</Label>
              <Select
                value={filterProps.activeFilters.categoryId?.toString() || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  categoryId: value === 'all' ? undefined : parseInt(value)
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {filterProps.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cor */}
          {filterProps.availableColors.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Cor</Label>
              <Select
                value={filterProps.activeFilters.color || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  color: value === 'all' ? undefined : value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cores</SelectItem>
                  {filterProps.availableColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tamanho */}
          {filterProps.availableSizes.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Tamanho</Label>
              <Select
                value={filterProps.activeFilters.size || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  size: value === 'all' ? undefined : value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tamanhos</SelectItem>
                  {filterProps.availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preço Mínimo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Preço Mínimo</Label>
            <Input
              type="text"
              placeholder="R$ 0,00"
              value={filterProps.activeFilters.minPrice || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '')
                filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  minPrice: value ? parseFloat(value.replace(',', '.')) : undefined
                })
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Preço Máximo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Preço Máximo</Label>
            <Input
              type="text"
              placeholder="R$ 999,99"
              value={filterProps.activeFilters.maxPrice || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '')
                filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  maxPrice: value ? parseFloat(value.replace(',', '.')) : undefined
                })
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={filterProps.onClearFilters}
            className="w-full"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Ordenação */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por</Label>
            <Select
              value={`${filterProps.sortFieldValue}-${filterProps.sortValue}`}
              onValueChange={(value) => {
                const [field, order] = value.split('-')
                filterProps.onSortChange(order, field)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-DESC">Mais recentes</SelectItem>
                <SelectItem value="created_at-ASC">Mais antigos</SelectItem>
                <SelectItem value="price-DESC">Maiores preços</SelectItem>
                <SelectItem value="price-ASC">Menores preços</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Produtos em Destaque */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Produtos em Destaque</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filterProps.activeFilters.featured || false}
                onCheckedChange={(checked) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  featured: checked
                })}
              />
              <Label className="text-sm text-gray-600">Mostrar apenas produtos em destaque</Label>
            </div>
          </div>

          {/* Categoria */}
          {filterProps.categories.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Categoria</Label>
              <Select
                value={filterProps.activeFilters.categoryId?.toString() || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  categoryId: value === 'all' ? undefined : parseInt(value)
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {filterProps.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cor */}
          {filterProps.availableColors.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Cor</Label>
              <Select
                value={filterProps.activeFilters.color || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  color: value === 'all' ? undefined : value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cores</SelectItem>
                  {filterProps.availableColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tamanho */}
          {filterProps.availableSizes.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Tamanho</Label>
              <Select
                value={filterProps.activeFilters.size || 'all'}
                onValueChange={(value) => filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  size: value === 'all' ? undefined : value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tamanhos</SelectItem>
                  {filterProps.availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preço Mínimo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Preço Mínimo</Label>
            <Input
              type="text"
              placeholder="R$ 0,00"
              value={filterProps.activeFilters.minPrice || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '')
                filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  minPrice: value ? parseFloat(value.replace(',', '.')) : undefined
                })
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Preço Máximo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Preço Máximo</Label>
            <Input
              type="text"
              placeholder="R$ 999,99"
              value={filterProps.activeFilters.maxPrice || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '')
                filterProps.onFilterChange({
                  ...filterProps.activeFilters,
                  maxPrice: value ? parseFloat(value.replace(',', '.')) : undefined
                })
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Botão Limpar Filtros */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={filterProps.onClearFilters}
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
