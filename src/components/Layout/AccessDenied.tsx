'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, Button } from '@/components'
import { ShieldX, ArrowLeft } from 'lucide-react'

interface AccessDeniedProps {
  title?: string
  message?: string
  showBackButton?: boolean
}

export default function AccessDenied({
  title = 'Acesso Não Permitido',
  message = 'Você não tem permissão para acessar esta página.',
  showBackButton = true
}: AccessDeniedProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldX className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showBackButton && (
              <Button

                onClick={() => router.back()}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            )}


          </div>
        </CardContent>
      </Card>
    </div>
  )
}

