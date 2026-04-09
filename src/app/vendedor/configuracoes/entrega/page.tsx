'use client'

import { useEntrega } from './useEntrega'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function EntregaPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    handleInputChange,
    handleSave
  } = useEntrega()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">Configurações de Entrega</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Configure as opções de entrega da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Taxa de Entrega */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Entrega</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="delivery_fee" className="text-sm font-medium text-gray-700">
                    Valor da Taxa de Entrega (R$)
                  </Label>
                  <Input
                    id="delivery_fee"
                    type="text"
                    value={formData.delivery_fee}
                    onChange={(e) => handleInputChange('delivery_fee', e.target.value)}
                    placeholder="Digite o valor da taxa de entrega"
                    className={`mt-2 ${errors.delivery_fee ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Valor cobrado pela entrega dos produtos
                    </p>
                    {errors.delivery_fee && (
                      <p className="text-sm text-red-600">{errors.delivery_fee}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="free_delivery_min" className="text-sm font-medium text-gray-700">
                    Valor Mínimo para Entrega Grátis (R$)
                  </Label>
                  <Input
                    id="free_delivery_min"
                    type="text"
                    value={formData.free_delivery_min}
                    onChange={(e) => handleInputChange('free_delivery_min', e.target.value)}
                    placeholder="Digite o valor mínimo para entrega gratuita"
                    className={`mt-2 ${errors.free_delivery_min ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Pedidos acima deste valor terão entrega gratuita
                    </p>
                    {errors.free_delivery_min && (
                      <p className="text-sm text-red-600">{errors.free_delivery_min}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tempo de Entrega */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tempo de Entrega</h3>
              <div>
                <Label htmlFor="delivery_time" className="text-sm font-medium text-gray-700">
                  Prazo de Entrega
                </Label>
                <Input
                  id="delivery_time"
                  value={formData.delivery_time}
                  onChange={(e) => handleInputChange('delivery_time', e.target.value)}
                  placeholder="Digite o prazo de entrega"
                  className={`mt-2 ${errors.delivery_time ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Tempo estimado para entrega dos produtos
                  </p>
                  {errors.delivery_time && (
                    <p className="text-sm text-red-600">{errors.delivery_time}</p>
                  )}
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
