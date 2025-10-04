'use client'

import { useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button, LoadingSpinner } from '@/components'
import { MapPin, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EnderecoPage() {
  const router = useRouter()
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    address: (store as any)?.address || '',
    city: (store as any)?.city || '',
    state: (store as any)?.state || '',
    zipcode: (store as any)?.zipcode || '',
    neighborhood: (store as any)?.neighborhood || '',
    number: (store as any)?.number || '',
    complement: (store as any)?.complement || ''
  })

  if (isLoading) {
    return <LoadingSpinner message="Carregando informações da loja..." />
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
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Configurações de Endereço</h1>
            <p className="text-xl text-gray-600 mt-2">
              Configure o endereço e localização da sua loja
            </p>
          </div>
        </div>
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-3 text-xl">
                Informações de Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-base font-semibold">
                  Endereço Completo
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua das Flores, 123"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-base font-semibold">
                  Cidade
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="São Paulo"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-base font-semibold">
                  Estado (UF)
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="SP"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="zipcode" className="text-base font-semibold">
                  CEP
                </Label>
                <Input
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={(e) => handleInputChange('zipcode', e.target.value)}
                  placeholder="01234-567"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="neighborhood" className="text-base font-semibold">
                  Bairro
                </Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Centro"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="number" className="text-base font-semibold">
                  Número
                </Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="123"
                  className="mt-2"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="complement" className="text-base font-semibold">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => handleInputChange('complement', e.target.value)}
                  placeholder="Apto 45, Bloco B"
                  className="mt-2"
                />
              </div>
            </div>

                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                   
                    className="flex items-center gap-3 px-8 py-3"
                  >
                    {isUpdating ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                     ""
                    )}
                    {isUpdating ? 'Salvando...' : 'Salvar Endereço'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Dicas */}
        <div className="space-y-6">
        

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Status do Endereço</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Endereço principal</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    formData.address 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {formData.address ? 'Preenchido' : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">CEP</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    formData.zipcode 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {formData.zipcode ? 'Preenchido' : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Cidade/Estado</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    formData.city && formData.state 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {formData.city && formData.state ? 'Preenchido' : 'Pendente'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
