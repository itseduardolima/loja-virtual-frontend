'use client'

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components'
import { CreditCard, AlertCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubscriptionBlockedProps {
  title?: string
  message?: string
  showManageButton?: boolean
}

export default function SubscriptionBlocked({
  title = 'Assinatura Cancelada',
  message = 'Sua assinatura foi cancelada. Para continuar usando a plataforma, é necessário renovar sua assinatura.',
  showManageButton = true,
}: SubscriptionBlockedProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{message}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Enquanto sua assinatura estiver cancelada:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Sua loja ficará inacessível para clientes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Você não poderá acessar o painel de controle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Não será possível gerenciar produtos e pedidos</span>
              </li>
            </ul>
          </div>

          {showManageButton && (
            <Button
              onClick={() => router.push('/vendedor/plano')}
              className="w-full"
              size="lg"
            >
              Gerenciar Assinatura
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

