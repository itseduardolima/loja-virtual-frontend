'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { Button, Card, CardContent } from '@/components'
import { 
  Store, 
  Phone, 
  Instagram,
  Image as ImageIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'
import LoadingPage from '@/components/LoadingPage'

export default function VendedorPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: store, isLoading: storeLoading } = useStore()

  if (authLoading) {
    return <LoadingPage />
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  if (storeLoading) {
    return <LoadingPage />
  }

  // Se não há loja, mostrar tela de criação
  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold">
                Bem-vindo, {user?.name}
              </h1>
              <h2 className="text-gray-600 mt-2 text-xl">
                Vamos criar sua loja!
              </h2>
            </div>

            {/* Card de Criação de Loja */}
            <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Store className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Crie sua primeira loja
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Configure sua loja online em poucos passos. Comece com as informações essenciais 
                    e complete os detalhes depois.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informações Básicas</h4>
                    <p className="text-sm text-gray-600 text-center">Nome, descrição e nicho da loja</p>
                  </div>
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contato</h4>
                    <p className="text-sm text-gray-600 text-center">WhatsApp e redes sociais</p>
                  </div>
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Endereço</h4>
                    <p className="text-sm text-gray-600 text-center">Localização e entrega</p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/vendedor/criar-loja')}
                  className="px-8 py-7  flex items-center gap-2 mx-auto"
                >
                  <Store className="h-5 w-5" />
                  Criar Minha Loja
                </Button>
              </CardContent>
            </Card>
          </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Minimalista */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Olá, {user?.name}
          </h1>
          <p className="text-gray-600">
            Gerencie sua loja e acompanhe suas vendas
          </p>
        </div>

        {/* Banner da Loja */}
        {store?.banner && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative min-h-[420px]">
              <Image
                src={buildImageUrl(store.banner)}
                alt="Banner da loja"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Informações da Loja */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Card Principal da Loja */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  {/* Logo da Loja */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                      {store?.logo ? (
                        <Image
                          src={buildImageUrl(store.logo)}
                          alt={`Logo da ${store.name}`}
                          width={80}
                          height={80}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const nextElement = target.nextElementSibling as HTMLElement
                            if (nextElement) nextElement.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${store?.logo ? 'hidden' : 'flex'}`}>
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Informações da Loja */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {store?.name}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {store?.description || 'Sem descrição'}
                    </p>

                    {/* Contatos */}
                    <div className="flex flex-wrap gap-4">
                      {store?.whatsapp && (
                        <a
                          href={`https://wa.me/${store.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-medium">{store.whatsapp}</span>
                        </a>
                      )}
                      {store?.instagram && (
                        <a
                          href={`https://instagram.com/${store.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm font-medium">@{store.instagram}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de Status */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Loja</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Produtos</span>
                    <span className="text-sm font-semibold text-gray-900">{store?._count?.products || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pedidos</span>
                    <span className="text-sm font-semibold text-gray-900">{store?._count?.orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Categorias</span>
                    <span className="text-sm font-semibold text-gray-900">{store?.categories?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}