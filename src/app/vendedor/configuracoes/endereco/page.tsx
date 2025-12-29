'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function EnderecoPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
    neighborhood: '',
    number: '',
    complement: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        address: (store as any)?.address || '',
        city: (store as any)?.city || '',
        state: (store as any)?.state || '',
        zipcode: (store as any)?.zipcode || '',
        neighborhood: (store as any)?.neighborhood || '',
        number: (store as any)?.number || '',
        complement: (store as any)?.complement || ''
      })
    }
  }, [store])

  if (isLoading) {
    return <LoadingPage />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: formData
      })
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
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
                  className="mt-2"
                />
              </div>
            </div>

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
