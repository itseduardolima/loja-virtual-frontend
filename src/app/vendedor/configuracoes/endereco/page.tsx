'use client'

import { useEndereco } from './useEndereco'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { Loader2 } from 'lucide-react'

export default function EnderecoPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    isFetchingCep,
    cepError,
    handleZipcodeChange,
    handleInputChange,
    handleSave
  } = useEndereco()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">Configurações de Endereço</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Configure o endereço e localização da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Endereço Completo
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Digite o endereço completo"
                  className={`mt-2 ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Cidade
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Digite a cidade"
                  className={`mt-2 ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  Estado (UF)
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Digite o estado"
                  className={`mt-2 ${errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zipcode" className="text-sm font-medium text-gray-700">
                  CEP
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="zipcode"
                    value={formData.zipcode}
                    onChange={(e) => handleZipcodeChange(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`${errors.zipcode || cepError ? 'border-red-500' : ''} ${isFetchingCep ? 'pr-10' : ''}`}
                  />
                  {isFetchingCep && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
                {cepError && (
                  <p className="mt-1 text-sm text-red-600">{cepError}</p>
                )}
                {errors.zipcode && !cepError && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipcode}</p>
                )}
              </div>

              <div>
                <Label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">
                  Bairro
                </Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Digite o bairro"
                  className={`mt-2 ${errors.neighborhood ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>
                )}
              </div>

              <div>
                <Label htmlFor="number" className="text-sm font-medium text-gray-700">
                  Número
                </Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="Digite o número"
                  className={`mt-2 ${errors.number ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="complement" className="text-sm font-medium text-gray-700">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => handleInputChange('complement', e.target.value)}
                  placeholder="Digite o complemento"
                  className={`mt-2 ${errors.complement ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.complement && (
                  <p className="mt-1 text-sm text-red-600">{errors.complement}</p>
                )}
              </div>
            </div>

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
