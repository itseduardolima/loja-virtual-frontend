'use client'

import { useDocumentos } from './useDocumentos'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { FileText, Building2, User } from 'lucide-react'

export default function DocumentosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    handleCNPJChange,
    handleCPFChange,
    handleSave
  } = useDocumentos()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">Documentos</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
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
                className={`mt-2 ${errors.cnpj ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  CNPJ da empresa (formato: 12.345.678/0001-90)
                </p>
                {errors.cnpj && (
                  <p className="text-sm text-red-600">{errors.cnpj}</p>
                )}
              </div>
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
                className={`mt-2 ${errors.cpf ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  CPF do vendedor (formato: 123.456.789-00)
                </p>
                {errors.cpf && (
                  <p className="text-sm text-red-600">{errors.cpf}</p>
                )}
              </div>
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
                disabled={isUpdating || !isFormValid}
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
