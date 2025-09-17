'use client'

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

interface CategoryFiltersProps {
  filters: {
    search?: string
    status?: number
    sort?: string
  }
  setFilters: (filters: any) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string, sortField: string) => void
  isSearching?: boolean
}

export function CategoryFilters({
  filters,
  setFilters,
  onSearchChange,
  isSearching = false
}: CategoryFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Buscar</label>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Buscar categorias..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                onSearchChange(e.target.value)
              }}
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
            value={filters.sort || 'ASC'}
            onValueChange={(value: string) => 
              setFilters((prev: any) => ({ ...prev, sort: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Nome A-Z</SelectItem>
              <SelectItem value="DESC">Nome Z-A</SelectItem>
              <SelectItem value="DATE_ASC">Data (Mais antigas)</SelectItem>
              <SelectItem value="DATE_DESC">Data (Mais recentes)</SelectItem>
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
      </div>
    </div>
  )
}
