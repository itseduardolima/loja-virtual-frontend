'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, Button, LoadingSpinner, Checkbox } from '@/components'
import { CreditCard } from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'

const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX', description: 'Pagamento instantâneo via PIX' },
  { id: 'credit_card', name: 'Cartão de Crédito', description: 'Visa, Mastercard, Elo' },
  { id: 'debit_card', name: 'Cartão de Débito', description: 'Débito em conta' },
  { id: 'boleto', name: 'Boleto Bancário', description: 'Pagamento via boleto' },
  { id: 'cash', name: 'Dinheiro', description: 'Pagamento em dinheiro' },
  { id: 'transfer', name: 'Transferência Bancária', description: 'Transferência via PIX ou TED' }
]

export default function PagamentoPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  useEffect(() => {
    if ((store as any)?.payment_methods) {
      setSelectedMethods((store as any).payment_methods)
    }
  }, [store])

  if (isLoading) {
    return <LoadingPage />
  }

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods(prev => {
      const currentMethods = Array.isArray(prev) ? prev : []
      return currentMethods.includes(methodId)
        ? currentMethods.filter(id => id !== methodId)
        : [...currentMethods, methodId]
    })
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: { payment_methods: selectedMethods }
      })
    } catch (error) {
      console.error('Erro ao atualizar métodos de pagamento:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          
          <h1 className="text-2xl font-semibold text-gray-900">Métodos de Pagamento</h1>
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

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating || selectedMethods.length === 0}
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
