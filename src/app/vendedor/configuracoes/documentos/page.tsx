'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { FileText, Building2, User } from 'lucide-react'

export default function DocumentosPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    cnpj: '',
    cpf: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        cnpj: (store as any)?.cnpj || '',
        cpf: (store as any)?.cpf || ''
      })
    }
  }, [store])

  if (isLoading) {
    return <LoadingPage />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    handleInputChange('cnpj', formatted)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    handleInputChange('cpf', formatted)
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: formData
      })
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentos</h1>
        <p className="text-gray-600">
          Configure os documentos fiscais da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* CNPJ */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                  CNPJ
                </Label>
              </div>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                placeholder="12.345.678/0001-90"
                maxLength={18}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                CNPJ da empresa (formato: 12.345.678/0001-90)
              </p>
            </div>

            {/* CPF */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-gray-600" />
                <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF do Vendedor
                </Label>
              </div>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                placeholder="123.456.789-00"
                maxLength={14}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                CPF do vendedor (formato: 123.456.789-00)
              </p>
            </div>

            {/* Informação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Informação Importante
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Os documentos são opcionais, mas podem ser necessários para algumas funcionalidades da plataforma.
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  ""
                )}
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

