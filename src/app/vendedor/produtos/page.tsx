'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { Button, Card, CardContent, CardHeader, Badge, LoadingSpinner, ErrorState } from '@/components'
import {
  Package,
  Plus,
  Trash2,
  Star,
  ArrowLeft,
  LogOut,
  ShoppingCart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'

export default function ProdutosPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: productsData, isLoading, error } = useProducts()

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(price))
  }

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        Inativo
      </Badge>
    )
  }

  const getFeaturedBadge = (featured: number) => {
    return featured === 1 ? (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Star className="h-3 w-3 mr-1" />
        Destaque
      </Badge>
    ) : null
  }

  if (isLoading) {
    return <LoadingSpinner message="Carregando produtos..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Erro ao carregar produtos"
        onRetry={() => window.location.reload()}
        retryText="Tentar novamente"
      />
    )
  }

  const products = productsData?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/vendedor')}
          className="flex items-center gap-2 mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-4xl font-bold">
                Meus Produtos
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie seus produtos e estoque
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="flex items-center gap-2"
              onClick={() => {/* TODO: Implementar criação de produto */ }}
            >
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{productsData?.meta.total || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.status === 1).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Destaque</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.featured === 1).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estoque Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Produtos */}
        {products.length === 0 ? (
          <Card className="border bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando seu primeiro produto para sua loja
              </p>
              <Button
                className="flex items-center gap-2"
                onClick={() => {/* TODO: Implementar criação de produto */ }}
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border bg-white/80 backdrop-blur-sm hover:shadow-md cursor-pointer transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-72 bg-gray-100 rounded-t-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={buildImageUrl(product.images[0])}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getFeaturedBadge(product.featured)}
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Estoque: {product.stock}
                      </span>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {/* TODO: Implementar exclusão */ }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
