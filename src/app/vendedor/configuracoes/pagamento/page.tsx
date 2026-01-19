'use client'

import { usePagamento, PAYMENT_METHODS } from './usePagamento'
import { Card, CardContent, Button, LoadingSpinner, Checkbox } from '@/components'
import { CreditCard } from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function PagamentoPage() {
  const {
    isLoading,
    isUpdating,
    selectedMethods,
    errors,
    isFormValid,
    handleMethodToggle,
    handleSave
  } = usePagamento()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Métodos de Pagamento</h1>
        </div>
        <p className="text-gray-600">
          Configure as formas de pagamento aceitas pela sua loja
        </p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleMethodToggle(method.id)}
                  className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    id={method.id}
                    checked={selectedMethods.includes(method.id)}
                    onCheckedChange={() => handleMethodToggle(method.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={method.id}
                      className="block cursor-pointer"
                    >
                      <h3 className="font-medium text-base text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {selectedMethods.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">Nenhum método selecionado</p>
                <p className="text-sm">Selecione pelo menos um método de pagamento</p>
              </div>
            )}

            {errors.payment_methods && (
              <p className="text-sm text-red-600">{errors.payment_methods}</p>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
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
