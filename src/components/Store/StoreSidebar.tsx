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
import { Niche, NicheField } from '@/types/niche'
import { StoreCategory } from '@/types/store'
import { COLOR_OPTIONS, getColorHex } from '@/schemas'

interface StoreSidebarProps extends StoreFiltersProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  variant?: 'sidebar' | 'inline'
  showSearch?: boolean
  storeId?: number | null
  storeCategories?: StoreCategory[]
  niches?: Niche[]
  categoryNicheMap?: Record<number, number>
}


export function StoreSidebar({
  isOpen,
  onClose,
  className = '',
  variant = 'sidebar',
  showSearch = false,
  storeId = null,
  availableDynamicFieldNames = [],
  storeCategories = [],
  niches = [],
  categoryNicheMap = {},
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
  const [localNicheId, setLocalNicheId] = useState<number | undefined>(filterProps.activeFilters.nicheId)
  const [localCategoryId, setLocalCategoryId] = useState<number | undefined>(filterProps.activeFilters.categoryId)
  const [localColor, setLocalColor] = useState<string | undefined>(filterProps.activeFilters.color)
  const [localSize, setLocalSize] = useState<string | undefined>(filterProps.activeFilters.size)
  const [localSort, setLocalSort] = useState<string>(filterProps.sortValue)
  const [localSortField, setLocalSortField] = useState<string>(filterProps.sortFieldValue)
  const [localMinRating, setLocalMinRating] = useState<number | undefined>(filterProps.activeFilters.minRating)
  // Usar nome do campo como chave (não slug) para unificar campos com mesmo nome
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string | string[]>>({})
  const [isPriceCollapsed, setIsPriceCollapsed] = useState(false) // Expandido por padrão
  const [isFieldsCollapsed, setIsFieldsCollapsed] = useState(false) // Expandido por padrão
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({}) // Usar nome do campo como chave
  const [expandedColorFields, setExpandedColorFields] = useState<Record<string, boolean>>({}) // Controlar expansão de cores
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({}) // Usar nome do campo como chave
  
  // Categoria aplicada (filtro já enviado para a API)
  const appliedCategoryId = filterProps.activeFilters.categoryId

  // Base de categorias: usa storeCategories se disponível, senão usa as derivadas dos produtos
  const baseCategories = storeCategories.length > 0 ? storeCategories : filterProps.categories

  // Categorias filtradas pelo nicho selecionado usando o mapa categoria→nicho
  const categoriesForSelectedNiche = localNicheId && Object.keys(categoryNicheMap).length > 0
    ? baseCategories.filter(cat => categoryNicheMap[cat.id] === localNicheId)
    : baseCategories

  // Filtrar apenas campos com opções (select e color), excluindo text, textarea e number
  // Mostra campos personalizados apenas quando há uma categoria aplicada,
  // filtrando pelos nomes de campos que existem nos produtos dessa categoria
  const fieldsWithOptions = fields.filter(field => {
    if (!(field.field_type === 'select' || field.field_type === 'color')) return false
    if (!field.options || !Array.isArray(field.options) || field.options.length === 0) return false
    // Só mostra campos personalizados quando uma categoria está aplicada
    if (!appliedCategoryId) return false
    // Se há campos dos produtos disponíveis, filtra por eles; senão não mostra nada
    if (availableDynamicFieldNames.length > 0) {
      return availableDynamicFieldNames.includes(field.name)
    }
    return false
  })
  
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
    localNicheId,
    localCategoryId,
    localColor,
    localSize,
    localMinRating,
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
  
  // Limpar filtros dinâmicos quando a categoria aplicada mudar
  useEffect(() => {
    setDynamicFieldValues({})
    setOpenDropdowns({})
  }, [filterProps.activeFilters.categoryId])

  // Atualizar os estados locais quando os filtros externos mudarem
  useEffect(() => {
    setPriceRange([
      filterProps.activeFilters.minPrice || 0,
      filterProps.activeFilters.maxPrice || 200
    ])
    setLocalFeatured(filterProps.activeFilters.featured || false)
    setLocalNicheId(filterProps.activeFilters.nicheId)
    setLocalCategoryId(filterProps.activeFilters.categoryId)
    setLocalColor(filterProps.activeFilters.color)
    setLocalSize(filterProps.activeFilters.size)
    setLocalMinRating(filterProps.activeFilters.minRating)
    setLocalSort(filterProps.sortValue)
    setLocalSortField(filterProps.sortFieldValue)
  }, [
    filterProps.activeFilters.minPrice,
    filterProps.activeFilters.maxPrice,
    filterProps.activeFilters.featured,
    filterProps.activeFilters.nicheId,
    filterProps.activeFilters.categoryId,
    filterProps.activeFilters.color,
    filterProps.activeFilters.size,
    filterProps.activeFilters.minRating,
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
      nicheId: localNicheId,
      categoryId: localCategoryId,
      color: localColor,
      size: localSize,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 200 ? priceRange[1] : undefined,
      dynamicFilters: Object.keys(dynamicFilters).length > 0 ? dynamicFilters : undefined,
      minRating: localMinRating,
    })
  }
  
  // Função para limpar filtros (também limpa os estados locais)
  const handleClearFilters = () => {
    setPriceRange([0, 200])
    setLocalFeatured(false)
    setLocalNicheId(undefined)
    setLocalCategoryId(undefined)
    setLocalColor(undefined)
    setLocalSize(undefined)
    setLocalMinRating(undefined)
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
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
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
        // Sempre usar COLOR_OPTIONS completo, combinando com opções do campo se existirem
        const fieldOptions = fieldGroup.fields[0]?.options && fieldGroup.fields[0].options.length > 0 
          ? fieldGroup.fields[0].options 
          : []
        // Combinar opções do campo com COLOR_OPTIONS, removendo duplicatas
        const allColorsSet = new Set([...COLOR_OPTIONS, ...fieldOptions])
        const allAvailableColors = Array.from(allColorsSet)
        
        // Mostrar mais cores inicialmente no filtro também
        const INITIAL_COLORS_COUNT_FILTER = 30
        const isColorExpanded = expandedColorFields[fieldName] || false
        const colorsToShow = isColorExpanded 
          ? allAvailableColors 
          : allAvailableColors.slice(0, INITIAL_COLORS_COUNT_FILTER)
        const hasMoreColors = allAvailableColors.length > INITIAL_COLORS_COUNT_FILTER
        
        return (
          <div className="space-y-2  w-full">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 w-full" style={{ maxWidth: '100%' }}>
              {colorsToShow.length > 0 ? (
                colorsToShow.map((color) => {
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
                      className={`relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        isSelected ? '' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                    >
                      {isSelected && (
                        <Check className="absolute inset-0 m-auto w-3 h-3 text-white stroke-2" />
                      )}
                    </button>
                  )
                })
              ) : (
                <span className="text-xs text-gray-500 col-span-6">Nenhuma cor disponível</span>
              )}
            </div>
            {hasMoreColors && (
              <button
                type="button"
                onClick={() => {
                  setExpandedColorFields(prev => ({
                    ...prev,
                    [fieldName]: !prev[fieldName]
                  }))
                }}
                className="w-full py-1.5 px-3 text-xs text-primary hover:text-primary/80 hover:bg-primary/5 border border-primary/20 rounded-xl transition-colors"
              >
                {isColorExpanded 
                  ? `Mostrar menos (${INITIAL_COLORS_COUNT_FILTER} cores)` 
                  : `Ver mais cores (${allAvailableColors.length - INITIAL_COLORS_COUNT_FILTER} cores adicionais)`
                }
              </button>
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
                  <SelectItem value="average_rating-DESC">Mais avaliados</SelectItem>
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
    <div className={`w-full ${isInline ? '' : 'lg:max-w-md'} ${isInline ? '' : 'bg-white  rounded-xl shadow-sm'} ${className}`} >
      <div style={{ overflowX: 'hidden', maxWidth: '100%', width: '100%' }}>
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
        <div className={`space-y-4 sm:space-y-6 ${isInline ? '' : 'px-4 sm:px-6 pt-4 sm:pt-6 lg:pt-0'} `}>
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
                <SelectItem value="average_rating-DESC">Mais avaliados</SelectItem>
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

          {/* Tipo de Produto (Nicho) */}
          {niches.length > 0 && (
            <div>
              <Label className="text-sm font-bold text-gray-900 cursor-pointer mb-2 block">Tipo de Produto</Label>
              <Select
                value={localNicheId?.toString() || 'all'}
                onValueChange={(value) => {
                  const newNicheId = value === 'all' ? undefined : parseInt(value)
                  setLocalNicheId(newNicheId)
                  // Limpa categoria ao trocar o tipo de produto
                  setLocalCategoryId(undefined)
                }}
              >
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {niches.map((niche) => (
                    <SelectItem key={niche.id} value={niche.id.toString()}>
                      {niche.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Categoria */}
          {categoriesForSelectedNiche.length > 0 && (
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
                  <SelectItem value="all">
                    {localNicheId ? 'Todas as categorias do tipo' : 'Todas as categorias'}
                  </SelectItem>
                  {categoriesForSelectedNiche.map((category) => (
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

          {/* Avaliação Mínima */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900 cursor-pointer block">Avaliação mínima</Label>
            <Select
              value={localMinRating?.toString() ?? 'all'}
              onValueChange={(v) => setLocalMinRating(v === 'all' ? undefined : Number(v))}
            >
              <SelectTrigger className="w-full h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Todas as avaliações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as avaliações</SelectItem>
                <SelectItem value="1">⭐ 1 estrela ou mais</SelectItem>
                <SelectItem value="2">⭐⭐ 2 estrelas ou mais</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 estrelas ou mais</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 estrelas ou mais</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ Somente 5 estrelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos Dinâmicos - exibe apenas quando uma categoria está aplicada e há campos disponíveis */}
          {appliedCategoryId && fieldsWithOptions.length > 0 && (
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
                <div className="space-y-3 pt-2 ">
                  {/* Campos unificados por nome */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto  pr-2">
                    {filteredGroupedFields.length > 0 ? (
                      filteredGroupedFields.map(([fieldName, fieldGroup]) => {
                        return (
                          <div key={fieldName} className="space-y-1.5  w-full">
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
          <div className="pt-4 space-y-2 mt-4 border-t border-gray-200 lg:border-t-0 sticky bottom-0 bg-white pb-4 lg:pb-6 lg:static -mx-4 sm:-mx-6 px-4 sm:px-6 lg:mx-0 lg:px-0 ">
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
