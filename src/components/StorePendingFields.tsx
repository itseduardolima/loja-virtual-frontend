'use client'

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components'
import { AlertCircle, Edit, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PendingField {
  id: string
  label: string
  description: string
  required: boolean
}

interface StorePendingFieldsProps {
  store: any
}

const PENDING_FIELDS: PendingField[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Número para contato dos clientes',
    required: false
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Rede social para divulgação',
    required: false
  },
  {
    id: 'address',
    label: 'Endereço',
    description: 'Localização da loja',
    required: false
  },
  {
    id: 'delivery_fee',
    label: 'Taxa de Entrega',
    description: 'Valor cobrado pela entrega',
    required: false
  },
  {
    id: 'payment_methods',
    label: 'Métodos de Pagamento',
    description: 'Formas de pagamento aceitas',
    required: false
  }
]

export function StorePendingFields({ store }: StorePendingFieldsProps) {
  const router = useRouter()

  const getPendingFields = () => {
    return PENDING_FIELDS.filter(field => {
      const value = store[field.id]
      return !value || (Array.isArray(value) && value.length === 0)
    })
  }

  const pendingFields = getPendingFields()

  if (pendingFields.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">
                Loja Completa!
              </h3>
              <p className="text-sm text-green-700">
                Todas as informações da sua loja estão preenchidas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          Informações Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-yellow-700">
          Complete essas informações para melhorar a experiência dos seus clientes:
        </p>
        
        <div className="space-y-3">
          {pendingFields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{field.label}</h4>
                <p className="text-sm text-gray-600">{field.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {field.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Obrigatório
                  </span>
                )}
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Pendente
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-yellow-200">
          <Button
            onClick={() => router.push('/vendedor/editar-loja')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Completar Informações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
