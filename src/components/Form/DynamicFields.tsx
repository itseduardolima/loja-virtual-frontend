'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/Layout/LoadingSpinner'
import { ErrorState } from '@/components/Layout/ErrorState'
import { useNicheFields } from '@/hooks/useNiches'
import { NicheField, NicheFieldValue } from '@/types'
import { getColorHex, COLOR_OPTIONS } from '@/schemas'
import { X, Check } from 'lucide-react'

interface DynamicFieldsProps {
  nicheId: number | null
  fieldValues: Record<string, NicheFieldValue>
  onFieldChange: (fieldId: number, value: string | string[]) => void
}

export function DynamicFields({ nicheId, fieldValues, onFieldChange }: DynamicFieldsProps) {
  const { data: fields, isLoading, error } = useNicheFields(nicheId)
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})
  const [expandedColorFields, setExpandedColorFields] = useState<Record<number, boolean>>({})
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({})
  
  // Número de cores a mostrar inicialmente
  const INITIAL_COLORS_COUNT = 20

  // Mapeamento preciso de cores para famílias
  const colorFamilyMap: Record<string, string> = {
    // Neutros
    'preto': 'neutros', 'branco': 'neutros', 'cinza': 'neutros', 'bege': 'neutros',
    'creme': 'neutros', 'off white': 'neutros', 'prata': 'neutros', 'platina': 'neutros',
    // Marrons e Terrosos
    'marrom': 'marrom', 'marrom claro': 'marrom', 'marrom escuro': 'marrom',
    'caramelo': 'marrom', 'café': 'marrom', 'chocolate': 'marrom', 'cobre': 'marrom',
    'terracota': 'marrom', 'bronze': 'marrom', 'camel': 'marrom', 'nude': 'marrom',
    // Azuis
    'azul': 'azul', 'azul marinho': 'azul', 'azul claro': 'azul', 'azul escuro': 'azul',
    'azul turquesa': 'azul', 'azul céu': 'azul', 'azul royal': 'azul',
    'turquesa': 'azul', 'ciano': 'azul', 'índigo': 'azul',
    // Vermelhos
    'vermelho': 'vermelho', 'vermelho escuro': 'vermelho', 'vermelho claro': 'vermelho',
    'vinho': 'vermelho', 'bordeaux': 'vermelho', 'coral': 'vermelho', 'salmão': 'vermelho',
    // Verdes
    'verde': 'verde', 'verde escuro': 'verde', 'verde claro': 'verde',
    'verde oliva': 'verde', 'verde lima': 'verde', 'verde menta': 'verde', 'verde esmeralda': 'verde',
    // Amarelos e Laranjas
    'amarelo': 'amarelo-laranja', 'amarelo claro': 'amarelo-laranja', 'amarelo ouro': 'amarelo-laranja',
    'dourado': 'amarelo-laranja', 'laranja': 'amarelo-laranja', 'laranja queimado': 'amarelo-laranja',
    'pêssego': 'amarelo-laranja', 'abricó': 'amarelo-laranja',
    // Rosas
    'rosa': 'rosa', 'rosa claro': 'rosa', 'rosa choque': 'rosa', 'rosa bebê': 'rosa',
    // Roxos
    'roxo': 'roxo', 'roxo escuro': 'roxo', 'lavanda': 'roxo', 'lilás': 'roxo',
    'magenta': 'roxo', 'violeta': 'roxo', 'púrpura': 'roxo',
  }

  // Função para identificar a família da cor com precisão
  const getColorFamily = (colorName: string): string => {
    const name = colorName.toLowerCase().trim()
    
    // Verificar mapeamento direto primeiro
    if (colorFamilyMap[name]) {
      return colorFamilyMap[name]
    }
    
    // Verificar por palavras-chave (fallback)
    for (const [key, family] of Object.entries(colorFamilyMap)) {
      if (name.includes(key)) {
        return family
      }
    }
    
    return 'outros'
  }

  // Função para converter hex para RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return [r, g, b]
  }

  // Função para converter RGB para HSL
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    
    return [h * 360, s, l]
  }

  // Função para calcular a luminosidade de uma cor hex
  const getLuminance = (hex: string): number => {
    const [r, g, b] = hexToRgb(hex)
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255
    
    // Aplica a fórmula de luminosidade relativa (W3C)
    const [rLinear, gLinear, bLinear] = [rNorm, gNorm, bNorm].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  // Função para ordenar cores por família, luminosidade e matiz
  const sortColors = (colors: string[]): string[] => {
    const familyOrder = ['neutros', 'marrom', 'azul', 'vermelho', 'verde', 'amarelo-laranja', 'rosa', 'roxo', 'outros']
    
    return [...colors].sort((a, b) => {
      const familyA = getColorFamily(a)
      const familyB = getColorFamily(b)
      
      // Ordenar por família primeiro
      const familyIndexA = familyOrder.indexOf(familyA)
      const familyIndexB = familyOrder.indexOf(familyB)
      
      if (familyIndexA !== familyIndexB) {
        return familyIndexA - familyIndexB
      }
      
      // Se mesma família, ordenar por luminosidade (claro para escuro)
      const hexA = getColorHex(a)
      const hexB = getColorHex(b)
      const luminanceA = getLuminance(hexA)
      const luminanceB = getLuminance(hexB)
      
      // Se a diferença de luminosidade for significativa (> 0.05), usar apenas luminosidade
      if (Math.abs(luminanceA - luminanceB) > 0.05) {
        return luminanceB - luminanceA // Maior luminosidade primeiro (mais claro)
      }
      
      // Se luminosidade similar, ordenar por matiz (hue) para manter tons relacionados juntos
      const [rA, gA, bA] = hexToRgb(hexA)
      const [rB, gB, bB] = hexToRgb(hexB)
      const [hueA] = rgbToHsl(rA, gA, bA)
      const [hueB] = rgbToHsl(rB, gB, bB)
      
      return hueA - hueB
    })
  }

  // Normalizar valores de cores quando os campos são carregados
  useEffect(() => {
    if (!fields || fields.length === 0) return
    
    fields.forEach(field => {
      if (field.field_type === 'color') {
        const fieldValue = fieldValues[field.id]?.value
        if (!fieldValue) return
        
        // Se já é um array, não precisa normalizar
        if (Array.isArray(fieldValue)) return
        
        // Processar o valor do campo
        const valueStr = String(fieldValue).trim()
        let selectedColors: string[] = []
        if (valueStr.includes(',')) {
          selectedColors = valueStr.split(',').map(c => c.trim()).filter(Boolean)
        } else {
          selectedColors = [valueStr]
        }
        
        // Normalizar cores para corresponder às cores disponíveis
        const fieldOptions = field.options && field.options.length > 0 ? field.options : []
        const allColorsSet = new Set([...COLOR_OPTIONS, ...fieldOptions])
        const availableColors = sortColors(Array.from(allColorsSet))
        
        const normalizeColorName = (color: string): string => color.toLowerCase().trim()
        const findMatchingColor = (selectedColor: string, availableColors: string[]): string | null => {
          const normalizedSelected = normalizeColorName(selectedColor)
          return availableColors.find(c => normalizeColorName(c) === normalizedSelected) || null
        }
        
        const normalizedSelectedColors = selectedColors
          .map(selectedColor => findMatchingColor(selectedColor, availableColors))
          .filter((color): color is string => color !== null)
        
        // Se as cores normalizadas são diferentes das originais, atualizar
        if (normalizedSelectedColors.length > 0 && 
            JSON.stringify(normalizedSelectedColors.sort()) !== JSON.stringify(selectedColors.sort())) {
          onFieldChange(field.id, normalizedSelectedColors)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, fieldValues])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openDropdowns).forEach(fieldId => {
        const dropdown = dropdownRefs.current[parseInt(fieldId)]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [parseInt(fieldId)]: false }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdowns])

  if (isLoading) {
    return (
      <Card className="p-8 bg-white border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 bg-white border-gray-200 shadow-sm">
        <ErrorState message="Erro ao carregar campos do nicho" />
      </Card>
    )
  }

  if (!fields || fields.length === 0) {
    return (
      <Card className="p-8 bg-white border-gray-200 shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum campo personalizado encontrado para este nicho</p>
        </div>
      </Card>
    )
  }

  const renderField = (field: NicheField) => {
    const fieldValue = fieldValues[field.id]?.value || ''
    const isRequired = field.required === 1
    
    // Verificar se o campo está vazio para validação visual (apenas se for obrigatório)
    const isEmpty = Array.isArray(fieldValue) 
      ? fieldValue.length === 0 
      : !fieldValue || fieldValue.toString().trim() === ''
    const showError = isRequired && isEmpty

    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Digite ${field.name.toLowerCase()}`}
              className={`h-12 ${showError ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="number"
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Digite ${field.name.toLowerCase()}`}
              className={`h-12 ${showError ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={`field-${field.id}`}
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Descreva ${field.name.toLowerCase()}`}
              rows={3}
              className={`resize-none ${showError ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'select':
        const selectedOptions = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : [])
        
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative" ref={el => { dropdownRefs.current[field.id] = el }}>
              <div 
                className={`h-12 px-3 py-2 border rounded-xl bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors ${showError ? 'border-red-500' : 'border-gray-200'}`}
                onClick={() => setOpenDropdowns(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
              >
                <span className={selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedOptions.length > 0 ? selectedOptions.join(', ') : `Selecione ${field.name.toLowerCase()}`}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns[field.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdowns[field.id] && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                {field.options.map((option) => {
                  const isSelected = selectedOptions.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const newSelection = isSelected 
                          ? selectedOptions.filter(o => o !== option)
                          : [...selectedOptions, option]
                        onFieldChange(field.id, newSelection)
                      }}
                      className={`
                        w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3
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
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span>{option}</span>
                    </button>
                  )
                })}
                </div>
              )}
            </div>
          </div>
        )

      case 'color':
        // Processar o valor do campo - pode ser array, string única ou string com vírgulas
        let selectedColors: string[] = []
        if (Array.isArray(fieldValue)) {
          selectedColors = fieldValue
        } else if (fieldValue) {
          const valueStr = String(fieldValue).trim()
          // Se contém vírgula, fazer split e limpar espaços
          if (valueStr.includes(',')) {
            selectedColors = valueStr.split(',').map(c => c.trim()).filter(Boolean)
          } else {
            selectedColors = [valueStr]
          }
        }
        
        // Função helper para normalizar nomes de cores (case-insensitive)
        const normalizeColorName = (color: string): string => {
          return color.toLowerCase().trim()
        }
        
        // Função helper para encontrar cor correspondente na lista disponível (case-insensitive)
        const findMatchingColor = (selectedColor: string, availableColors: string[]): string | null => {
          const normalizedSelected = normalizeColorName(selectedColor)
          return availableColors.find(c => normalizeColorName(c) === normalizedSelected) || null
        }
        
        // Sempre usar COLOR_OPTIONS completo, combinando com opções do campo se existirem
        const fieldOptions = field.options && field.options.length > 0 ? field.options : []
        // Combinar opções do campo com COLOR_OPTIONS, removendo duplicatas
        const allColorsSet = new Set([...COLOR_OPTIONS, ...fieldOptions])
        // Ordenar cores por família e luminosidade
        const availableColors = sortColors(Array.from(allColorsSet))
        
        // Normalizar cores selecionadas para corresponder às cores disponíveis
        const normalizedSelectedColors = selectedColors
          .map(selectedColor => findMatchingColor(selectedColor, availableColors))
          .filter((color): color is string => color !== null)
        
        const isExpanded = expandedColorFields[field.id] || false
        const colorsToShow = isExpanded 
          ? availableColors 
          : availableColors.slice(0, INITIAL_COLORS_COUNT)
        const hasMoreColors = availableColors.length > INITIAL_COLORS_COUNT
        
        return (
          <div key={field.id} className="w-full sm:col-span-2">
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-3 block">
              {field.name} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 xl:grid-cols-16 gap-2 sm:gap-2.5 md:gap-3 p-2.5 sm:p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50/50 min-h-[100px] sm:min-h-[120px] justify-items-center">
              {colorsToShow.map((color) => {
                const isSelected = normalizedSelectedColors.includes(color)
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const newSelection = isSelected 
                        ? normalizedSelectedColors.filter(c => c !== color)
                        : [...normalizedSelectedColors, color]
                      onFieldChange(field.id, newSelection)
                    }}
                    className={`
                      relative rounded-full border-2 transition-all duration-200 shadow-sm flex-shrink-0
                      w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12
                      hover:scale-110 hover:shadow-md
                      ${isSelected 
                        ? 'border-primary ring-2 ring-primary ring-offset-1 sm:ring-offset-2' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white stroke-2 drop-shadow-md" />
                    )}
                  </button>
                )
              })}
            </div>
            {hasMoreColors && (
              <button
                type="button"
                onClick={() => {
                  setExpandedColorFields(prev => ({
                    ...prev,
                    [field.id]: !prev[field.id]
                  }))
                }}
                className="mt-3 w-full py-2 px-4 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/5 border border-primary/20 rounded-lg transition-colors"
              >
                {isExpanded 
                  ? `Mostrar menos (${INITIAL_COLORS_COUNT} cores)` 
                  : `Ver mais cores (${availableColors.length - INITIAL_COLORS_COUNT} cores adicionais)`
                }
              </button>
            )}
            {normalizedSelectedColors.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                Cor selecionada: <span className="font-semibold text-gray-900">{normalizedSelectedColors.join(', ')}</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Campos Personalizados</h2>
        <p className="text-sm text-gray-500">
          Preencha os campos específicos para este nicho de produto
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields
          .sort((a, b) => {
            // Verificar se é campo de cor (por tipo ou nome)
            const aIsColor = a.field_type === 'color' || a.name.toLowerCase() === 'cor'
            const bIsColor = b.field_type === 'color' || b.name.toLowerCase() === 'cor'
            
            // Se um é cor e o outro não, o cor vem primeiro
            if (aIsColor && !bIsColor) return -1
            if (!aIsColor && bIsColor) return 1
            
            // Se ambos são cor ou nenhum é cor, ordenar por sort_order
            return a.sort_order - b.sort_order
          })
          .map(renderField)
        }
      </div>
    </Card>
  )
}
