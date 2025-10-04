'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/hooks/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, Store, Image as ImageIcon, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { data: store, isLoading: storeLoading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated && user) {
      // Redirecionar para a página específica do perfil
      const routes = {
        'Administrador': '/admin',
        'Vendedor': '/vendedor',
        'Cliente': '/cliente'
      }
      const route = routes[user.profile]
      if (route) {
        router.push(route)
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Bem-vindo de volta, {user?.name}!
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Banner da Loja */}
        {user?.profile === 'Vendedor' && (
          <Card className="mb-8 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
              {store?.banner ? (
                <Image
                  src={store.banner}
                  alt="Banner da loja"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">Banner da Loja</p>
                    <p className="text-sm opacity-75">Adicione um banner para personalizar sua loja</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Cards de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Informações do Usuário */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Informações do Usuário
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Perfil:</strong> {user?.profile}</p>
                <p><strong>ID do Perfil:</strong> {user?.profile_id}</p>
                <p><strong>Primeiro Acesso:</strong> {user?.first_access ? 'Sim' : 'Não'}</p>
                {user?.transactions && user.transactions.length > 0 && (
                  <p><strong>Transações:</strong> {user.transactions.join(', ')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações da Loja */}
          {user?.profile === 'Vendedor' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Minha Loja
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {storeLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : store ? (
                  <div className="space-y-4">
                    {/* Logo da Loja */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {store.logo ? (
                          <Image
                            src={store.logo}
                            alt="Logo da loja"
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm text-gray-600">{store.description || 'Sem descrição'}</p>
                      </div>
                    </div>
                    
                    {/* Status da Loja */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (store as any).status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(store as any).status === 'active' ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Produtos:</span>
                        <span>{(store as any).products_count || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pedidos:</span>
                        <span>{(store as any).orders_count || 0}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Nenhuma loja cadastrada</p>
                    <Button 
                      onClick={() => router.push('/vendedor/criar-loja')}
                      size="sm"
                    >
                      Criar Loja
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vendas Hoje</span>
                  <span className="text-2xl font-bold text-green-600">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vendas do Mês</span>
                  <span className="text-2xl font-bold text-blue-600">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de Pedidos</span>
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        {user?.profile === 'Vendedor' && store && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push('/vendedor/produtos')}
                >
                  <Store className="w-6 h-6" />
                  <span>Gerenciar Produtos</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push('/vendedor/pedidos')}
                >
                  <User className="w-6 h-6" />
                  <span>Ver Pedidos</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push('/vendedor/configuracoes/endereco')}
                >
                  <ImageIcon className="w-6 h-6" />
                  <span>Configurações</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push('/vendedor')}
                >
                  <Store className="w-6 h-6" />
                  <span>Dashboard Completo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
