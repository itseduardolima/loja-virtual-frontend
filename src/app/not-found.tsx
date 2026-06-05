import { Card, CardContent } from '@/components'
import { NotFoundContent } from '@/components/Layout'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-9xl font-bold text-gray-200 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Página Não Encontrada
          </h1>
          
          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
            Verifique o endereço e tente novamente.
          </p>
          
          <NotFoundContent />
        </CardContent>
      </Card>
    </div>
  )
}

