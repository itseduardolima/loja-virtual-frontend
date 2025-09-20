'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '@/components'
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Tag, 
  Phone, 
  Instagram,
  LogOut,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'

export default function VendedorPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: store, isLoading: storeLoading } = useStore()

  if (authLoading) {
    return <LoadingSpinner message="Carregando autenticação..." />
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (storeLoading) {
    return <LoadingSpinner message="Carregando dados da loja..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>
            <h2 className="text-gray-600 mt-2 text-xl">
              Bem-vindo, {user?.name}
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Informações Principais da Loja */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Card Principal da Loja */}
          <div className="flex-1 lg:flex-[2] border rounded-lg">
            <Card className="flex flex-col border-none shadow-none">
              <CardHeader className=" rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Store className="h-6 w-6" />
                  </div>
                  Informações da Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="text-center">
                    {store?.logo && (
                      <div className="mb-4 flex justify-center">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={buildImageUrl(store.logo)}
                            alt={`Logo da ${store.name}`}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {store?.name}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{store?.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 justify-start mt-6">
                  {store?.whatsapp && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">WhatsApp</p>
                        <p className="text-green-700 font-mono">{store.whatsapp}</p>
                      </div>
                    </div>
                  )}
                  {store?.instagram && (
                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border border-pink-200">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Instagram className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-pink-800">Instagram</p>
                        <p className="text-pink-700">@{store.instagram}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500 rounded-xl">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800">Produtos</p>
                          <p className="text-xs text-blue-600">Total cadastrados</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-blue-900">{store?._count?.products || 0}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500 rounded-xl">
                          <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800">Pedidos</p>
                          <p className="text-xs text-green-600">Total realizados</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-green-900">{store?._count?.orders || 0}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500 rounded-xl">
                          <Tag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">Categorias</p>
                          <p className="text-xs text-purple-600">Total criadas</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-purple-900">{store?.categories?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border  transition-shadow cursor-pointer group"
                onClick={() => router.push('/vendedor/produtos')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Meus Produtos</h3>
                    <p className="text-sm text-gray-600">Gerencie seu catálogo</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow cursor-pointer group"
                onClick={() => router.push('/vendedor/categorias')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <Tag className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
                    <p className="text-sm text-gray-600">Organize seus produtos</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow cursor-pointer group"
                onClick={() => router.push('/vendedor/pedidos')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pedidos</h3>
                    <p className="text-sm text-gray-600">Gerencie seus pedidos</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                    <p className="text-sm text-gray-600">Análise de vendas</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
