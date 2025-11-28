'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/Layout/LoadingSpinner'
import { ErrorState } from '@/components/Layout/ErrorState'
import { useNicheFields } from '@/hooks/useNiches'
import { NicheField, NicheFieldValue } from '@/types'
import { getColorHex } from '@/schemas'
import { X } from 'lucide-react'

interface DynamicFieldsProps {
  nicheId: number | null
  fieldValues: Record<string, NicheFieldValue>
  onFieldChange: (fieldId: number, value: string | string[]) => void
}

export function DynamicFields({ nicheId, fieldValues, onFieldChange }: DynamicFieldsProps) {
  const { data: fields, isLoading, error } = useNicheFields(nicheId)
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({})

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
    
    // Verificar se o campo está vazio para validação visual
    const isEmpty = Array.isArray(fieldValue) 
      ? fieldValue.length === 0 
      : !fieldValue || fieldValue.toString().trim() === ''

    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`field-${field.id}`}
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Digite ${field.name.toLowerCase()}`}
              className={`h-12 ${isEmpty ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`field-${field.id}`}
              type="number"
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Digite ${field.name.toLowerCase()}`}
              className={`h-12 ${isEmpty ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id={`field-${field.id}`}
              value={fieldValue as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={`Descreva ${field.name.toLowerCase()}`}
              rows={3}
              className={`resize-none ${isEmpty ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
            />
          </div>
        )

      case 'select':
        const selectedOptions = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : [])
        
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} <span className="text-red-500">*</span>
            </Label>
            <div className="relative" ref={el => { dropdownRefs.current[field.id] = el }}>
              <div 
                className={`h-12 px-3 py-2 border rounded-md bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors ${isEmpty ? 'border-red-500' : 'border-gray-200'}`}
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
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
        const selectedColors = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : [])
        
        return (
          <div key={field.id}>
            <Label htmlFor={`field-${field.id}`} className="text-sm font-semibold text-gray-700 mb-2 block">
              {field.name} <span className="text-red-500">*</span>
            </Label>
            <div className={`grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-2  rounded-md`}>
              {field.options.map((color) => {
                const isSelected = selectedColors.includes(color)
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const newSelection = isSelected 
                        ? selectedColors.filter(c => c !== color)
                        : [...selectedColors, color]
                      onFieldChange(field.id, newSelection)
                    }}
                    className={`
                      w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm
                      ${isSelected 
                        ? 'border-primary' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                )
              })}
            </div>
            {selectedColors.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selecionado: {selectedColors.join(', ')}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-8 bg-white border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Campos Personalizados</h2>
        <p className="text-sm text-gray-500">
          Preencha os campos específicos para este nicho de produto
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(renderField)
        }
      </div>
    </Card>
  )
}
