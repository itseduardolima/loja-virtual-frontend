'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function EntregaPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    delivery_fee: '',
    free_delivery_min: '',
    delivery_time: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        delivery_fee: (store as any)?.delivery_fee || '',
        free_delivery_min: (store as any)?.free_delivery_min || '',
        delivery_time: (store as any)?.delivery_time || ''
      })
    }
  }, [store])

  if (isLoading) {
    return <LoadingPage />
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: {
          delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee) : 0,
          free_delivery_min: formData.free_delivery_min ? parseFloat(formData.free_delivery_min) : 0,
          delivery_time: formData.delivery_time
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar configurações de entrega:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações de Entrega</h1>
        <p className="text-gray-600">
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
                    placeholder="5.50"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valor cobrado pela entrega dos produtos
                  </p>
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
                    placeholder="50.00"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pedidos acima deste valor terão entrega gratuita
                  </p>
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
                  placeholder="2-3 dias úteis"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tempo estimado para entrega dos produtos
                </p>
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
                {isUpdating ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
