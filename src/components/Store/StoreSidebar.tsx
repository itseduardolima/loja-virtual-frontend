'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Filter, ChevronUp, Check } from 'lucide-react'
import { StoreFiltersProps } from '@/app/loja/[slug]/produtos/types'
import { formatPrice } from '@/lib/utils'
import { useStoreFields } from '@/hooks/useNiches'
import { NicheField } from '@/types/niche'

interface StoreSidebarProps extends StoreFiltersProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  variant?: 'sidebar' | 'inline'
  showSearch?: boolean
  storeId?: number | null
}

function getColorValue(color: string): string {
  const colorMap: { [key: string]: string } = {
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Azul': '#0000FF',
    'Vermelho': '#FF0000',
    'Verde': '#00FF00',
    'Amarelo': '#FFFF00',
    'Rosa': '#FFC0CB',
    'Roxo': '#800080',
    'Cinza': '#808080',
    'Marrom': '#A52A2A',
    'Laranja': '#FFA500',
    'Ciano': '#00FFFF'
  }
  return colorMap[color] || '#E5E7EB'
}

export function StoreSidebar({
  isOpen,
  onClose,
  className = '',
  variant = 'sidebar',
  showSearch = false,
  storeId = null,
  ...filterProps
}: StoreSidebarProps) {
  const isInline = variant === 'inline'
  
  // Hook para buscar todos os campos de todos os nichos da loja
  const { data: storeFields } = useStoreFields(storeId)
  const fields = storeFields || []
  
  // Estados locais para os filtros (não aplicados até clicar no botão)
  const [priceRange, setPriceRange] = useState<number[]>([
    filterProps.activeFilters.minPrice || 0,
    filterProps.activeFilters.maxPrice || 200
  ])
  const [localFeatured, setLocalFeatured] = useState<boolean>(filterProps.activeFilters.featured || false)
  const [localCategoryId, setLocalCategoryId] = useState<number | undefined>(filterProps.activeFilters.categoryId)
  const [localColor, setLocalColor] = useState<string | undefined>(filterProps.activeFilters.color)
  const [localSize, setLocalSize] = useState<string | undefined>(filterProps.activeFilters.size)
  const [localSort, setLocalSort] = useState<string>(filterProps.sortValue)
  const [localSortField, setLocalSortField] = useState<string>(filterProps.sortFieldValue)
  // Usar nome do campo como chave (não slug) para unificar campos com mesmo nome
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string | string[]>>({})
  const [isPriceCollapsed, setIsPriceCollapsed] = useState(false) // Expandido por padrão
  const [isFieldsCollapsed, setIsFieldsCollapsed] = useState(false) // Expandido por padrão
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({}) // Usar nome do campo como chave
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({}) // Usar nome do campo como chave
  
  // Filtrar apenas campos com opções (select e color), excluindo text, textarea e number
  const fieldsWithOptions = fields.filter(field => 
    (field.field_type === 'select' || field.field_type === 'color') && 
    field.options && 
    Array.isArray(field.options) && 
    field.options.length > 0
  )
  
  // Agrupar campos por nome (unificar campos com mesmo nome de diferentes nichos)
  const groupedFieldsByName = fieldsWithOptions.reduce((acc, field) => {
    const fieldName = field.name
    if (!acc[fieldName]) {
      acc[fieldName] = {
        fields: [],
        allOptions: new Set<string>(),
        fieldType: field.field_type,
        // Usar o primeiro campo como referência para tipo e outras propriedades
        referenceField: field
      }
    }
    acc[fieldName].fields.push(field)
    // Combinar todas as opções de todos os campos com mesmo nome
    if (field.options && Array.isArray(field.options)) {
      field.options.forEach(option => acc[fieldName].allOptions.add(option))
    }
    return acc
  }, {} as Record<string, {
    fields: NicheField[]
    allOptions: Set<string>
    fieldType: string
    referenceField: NicheField
  }>)
  
  // Converter para array de entradas (sem filtro de busca)
  const filteredGroupedFields = Object.entries(groupedFieldsByName)
  
  // Contar filtros ativos
  const activeFiltersCount = [
    localFeatured,
    localCategoryId,
    localColor,
    localSize,
    priceRange[0] > 0 || priceRange[1] < 200,
    Object.keys(dynamicFieldValues).length > 0
  ].filter(Boolean).length
  
  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openDropdowns).forEach(fieldName => {
        const dropdown = dropdownRefs.current[fieldName]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [fieldName]: false }))
        }
      })
    }

    if (Object.values(openDropdowns).some(open => open)) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdowns])
  
  // Atualizar os estados locais quando os filtros externos mudarem
  useEffect(() => {
    setPriceRange([
      filterProps.activeFilters.minPrice || 0,
      filterProps.activeFilters.maxPrice || 200
    ])
    setLocalFeatured(filterProps.activeFilters.featured || false)
    setLocalCategoryId(filterProps.activeFilters.categoryId)
    setLocalColor(filterProps.activeFilters.color)
    setLocalSize(filterProps.activeFilters.size)
    setLocalSort(filterProps.sortValue)
    setLocalSortField(filterProps.sortFieldValue)
  }, [
    filterProps.activeFilters.minPrice, 
    filterProps.activeFilters.maxPrice,
    filterProps.activeFilters.featured,
    filterProps.activeFilters.categoryId,
    filterProps.activeFilters.color,
    filterProps.activeFilters.size,
    filterProps.sortValue,
    filterProps.sortFieldValue
  ])
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }
  
  const handleApplyAndClose = () => {
    handleApplyFilters()
    // Pequeno delay para garantir que os filtros sejam aplicados antes de fechar
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        onClose()
      }
    }, 100)
  }

  const handleApplyFilters = () => {

    filterProps.onSortChange(localSort, localSortField)
    
    // Usar nome do campo diretamente como chave (já está unificado)
    const dynamicFilters: Record<string, string> = {}
    Object.entries(dynamicFieldValues).forEach(([fieldName, value]) => {
      if (value) {
        const valuesArray = Array.isArray(value) ? value : [value]
        if (valuesArray.length > 0) {
          dynamicFilters[fieldName] = valuesArray.join(', ')
        }
      }
    })
    
    // Aplicar filtros
    filterProps.onFilterChange({
      featured: localFeatured || undefined,
      categoryId: localCategoryId,
      color: localColor,
      size: localSize,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 200 ? priceRange[1] : undefined,
      dynamicFilters: Object.keys(dynamicFilters).length > 0 ? dynamicFilters : undefined
    })
  }
  
  // Função para limpar filtros (também limpa os estados locais)
  const handleClearFilters = () => {
    setPriceRange([0, 200])
    setLocalFeatured(false)
    setLocalCategoryId(undefined)
    setLocalColor(undefined)
    setLocalSize(undefined)
    setLocalSort('DESC')
    setLocalSortField('created_at')
    setDynamicFieldValues({})
    setOpenDropdowns({})
    filterProps.onClearFilters()
  }
  
  // Função para renderizar campo dinâmico unificado baseado no tipo
  const renderUnifiedField = (fieldName: string, fieldGroup: {
    fields: NicheField[]
    allOptions: Set<string>
    fieldType: string
    referenceField: NicheField
  }) => {
    const fieldValue = dynamicFieldValues[fieldName] || ''
    const selectedOptions = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : [])
    const allOptionsArray = Array.from(fieldGroup.allOptions).sort()
    const field = fieldGroup.referenceField
    
    switch (fieldGroup.fieldType) {
      case 'select':
        return (
          <div className="relative" ref={el => { dropdownRefs.current[fieldName] = el }}>
            <div 
              className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
              onClick={() => setOpenDropdowns(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
            >
              <span className={selectedOptions.length > 0 ? 'text-gray-900 text-sm' : 'text-gray-500 text-sm'}>
                {selectedOptions.length > 0 
                  ? selectedOptions.length === 1 
                    ? selectedOptions[0]
                    : `${selectedOptions.length} selecionados`
                  : `Selecione ${fieldName.toLowerCase()}`
                }
              </span>
              <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns[fieldName] ? 'rotate-180' : ''}`} />
            </div>
            {openDropdowns[fieldName] && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {allOptionsArray.length > 0 ? (
                  allOptionsArray.map((option) => {
                    const isSelected = selectedOptions.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newSelection = isSelected 
                            ? selectedOptions.filter(o => o !== option)
                            : [...selectedOptions, option]
                          setDynamicFieldValues({
                            ...dynamicFieldValues,
                            [fieldName]: newSelection.length === 1 ? newSelection[0] : newSelection
                          })
                        }}
                        className={`
                          w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm
                          ${isSelected ? 'bg-gray-50' : ''}
                        `}
                      >
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center
                          ${isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white stroke-2" />
                          )}
                        </div>
                        <span>{option}</span>
                      </button>
                    )
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">Nenhuma opção disponível</div>
                )}
              </div>
            )}
          </div>
        )
      
      case 'color':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {allOptionsArray.length > 0 ? (
                allOptionsArray.map((color) => {
                  const isSelected = selectedOptions.includes(color)
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        const newSelection = isSelected 
                          ? selectedOptions.filter(c => c !== color)
                          : [...selectedOptions, color]
                        setDynamicFieldValues({
                          ...dynamicFieldValues,
                          [fieldName]: newSelection.length === 1 ? newSelection[0] : newSelection
                        })
                      }}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        isSelected ? 'ring-2 ring-primary border-primary' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: getColorValue(color) }}
                      title={color}
                    >
                      {isSelected && (
                        <Check className="absolute inset-0 m-auto w-4 h-4 text-white stroke-2" />
                      )}
                    </button>
                  )
                })
              ) : (
                <span className="text-xs text-gray-500 col-span-5">Nenhuma cor disponível</span>
              )}
            </div>
            {selectedOptions.length > 0 && (
              <div className="text-xs text-gray-600">
                Selecionado: {selectedOptions.join(', ')}
              </div>
            )}
          </div>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={`Digite ${fieldName}`}
            value={fieldValue as string}
            onChange={(e) => {
              setDynamicFieldValues({
                ...dynamicFieldValues,
                [fieldName]: e.target.value
              })
            }}
          />
        )
      
      case 'text':
      case 'textarea':
      default:
        return (
          <Input
            type="text"
            placeholder={`Digite ${fieldName}`}
            value={fieldValue as string}
            onChange={(e) => {
              setDynamicFieldValues({
                ...dynamicFieldValues,
                [fieldName]: e.target.value
              })
            }}
          />
        )
    }
  }

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
            <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Produtos em Destaque</Label>
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
              <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Categoria</Label>
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
              <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Cor</Label>
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
              <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Tamanho</Label>
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
            <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Preço Mínimo</Label>
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
            <Label className="text-sm font-bold text-primary cursor-pointer mb-2 block">Preço Máximo</Label>
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

  // Verificação condicional APÓS todos os hooks e funções
  if (!isOpen) return null

  return (
    <div className={`w-full ${isInline ? '' : 'lg:max-w-sm'} ${isInline ? '' : 'bg-white  rounded-lg shadow-sm'} ${className}`}>
      <div className={`${isInline ? 'p-0' : ''}`}>
        {/* Header - Apenas para desktop sidebar */}
        {!isInline && (
          <div className="hidden lg:flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-6 pt-4 sm:pt-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
          </div>
        )}

        {/* Filters */}
        <div className={`space-y-4 sm:space-y-6 ${isInline ? '' : 'px-4 sm:px-6 pt-4 sm:pt-6 lg:pt-0'}`}>
          {/* Ordenação */}
          <div>
            <Label className="text-sm font-bold text-gray-900 cursor-pointer mb-2 block">Ordenar por</Label>
            <Select
              value={`${localSortField}-${localSort}`}
              onValueChange={(value) => {
                const [field, order] = value.split('-')
                setLocalSortField(field)
                setLocalSort(order)
              }}
            >
              <SelectTrigger className="w-full h-10 sm:h-11 text-sm">
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
            <Label className="text-sm font-bold text-gray-900 cursor-pointer mb-2 block">Produtos em Destaque</Label>
            <div className="flex items-center space-x-3">
              <Switch
                checked={localFeatured}
                onCheckedChange={(checked) => setLocalFeatured(checked)}
              />
              <Label className="text-sm text-gray-600 cursor-pointer">Mostrar apenas produtos em destaque</Label>
            </div>
          </div>

          {/* Categoria */}
          {filterProps.categories.length > 0 && (
            <div>
              <Label className="text-sm font-bold text-gray-900 cursor-pointer mb-2 block">Categoria</Label>
              <Select
                value={localCategoryId?.toString() || 'all'}
                onValueChange={(value) => setLocalCategoryId(value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm">
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

          {/* Price Filter */}
          <div className="space-y-4">
            <button
              onClick={() => setIsPriceCollapsed(!isPriceCollapsed)}
              className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <Label className="text-sm font-bold text-gray-900 cursor-pointer">Preço</Label>
              <ChevronUp className={`w-4 h-4 text-gray-600 transition-transform ${isPriceCollapsed ? 'rotate-180' : ''}`} />
            </button>
            {!isPriceCollapsed && (
              <div className="space-y-3">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Campos Dinâmicos */}
          {fieldsWithOptions.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setIsFieldsCollapsed(!isFieldsCollapsed)}
                className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <Label className="text-sm font-bold text-gray-900 cursor-pointer">
                  Filtros Personalizados
                  {Object.keys(dynamicFieldValues).length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                      {Object.keys(dynamicFieldValues).length}
                    </span>
                  )}
                </Label>
                <ChevronUp className={`w-4 h-4 text-gray-600 transition-transform ${isFieldsCollapsed ? 'rotate-180' : ''}`} />
              </button>
              {!isFieldsCollapsed && (
                <div className="space-y-3 pt-2">
                  {/* Campos unificados por nome */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {filteredGroupedFields.length > 0 ? (
                      filteredGroupedFields.map(([fieldName, fieldGroup]) => {
                        return (
                          <div key={fieldName} className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700 cursor-pointer">
                              {fieldName}
                            </Label>
                            {renderUnifiedField(fieldName, fieldGroup)}
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Nenhum filtro encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="pt-4 space-y-2 mt-4 border-t border-gray-200 lg:border-t-0 sticky bottom-0 bg-white pb-4 lg:pb-6 lg:static -mx-4 sm:-mx-6 px-4 sm:px-6 lg:mx-0 lg:px-0">
            <Button
              onClick={handleApplyAndClose}
              className="w-full bg-primary text-white hover:bg-primary/90 h-10 sm:h-11 text-sm sm:text-base font-medium shadow-sm"
            >
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleClearFilters()
                setTimeout(() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onClose()
                  }
                }, 100)
              }}
              className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
