'use client'

import { useEndereco } from './useEndereco'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function EnderecoPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    handleInputChange,
    handleSave
  } = useEndereco()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações de Endereço</h1>
        <p className="text-gray-600">
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
                <Input
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={(e) => handleInputChange('zipcode', e.target.value)}
                  placeholder="Digite o CEP"
                  className={`mt-2 ${errors.zipcode ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.zipcode && (
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
