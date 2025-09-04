'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, ShoppingCart, Heart, Package, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PROFILE_TRANSACTIONS } from '@/types/auth'

export default function ClientePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated && user?.profile !== 'Cliente') {
      const routes = {
        'Administrador': '/admin',
        'Vendedor': '/vendedor'
      }
      router.push(user?.profile ? routes[user.profile] || '/login' : '/login')
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

  if (!isAuthenticated || user?.profile !== 'Cliente') {
    return null
  }

  const clienteTransactions = PROFILE_TRANSACTIONS.Cliente

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Minha Conta
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {user?.name}! (Cliente)
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

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comprar
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Explorar</p>
              <p className="text-xs text-muted-foreground">
                Navegar e comprar produtos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favoritos
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Ver</p>
              <p className="text-xs text-muted-foreground">
                Seus produtos favoritos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Acompanhar</p>
              <p className="text-xs text-muted-foreground">
                Seus pedidos e entregas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagamentos
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Gerenciar</p>
              <p className="text-xs text-muted-foreground">
                Formas de pagamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Usuário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Informações do Cliente
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transações Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Transações que você pode executar:
                </p>
                <div className="flex flex-wrap gap-2">
                  {clienteTransactions.map((transaction) => (
                    <span
                      key={transaction}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      {transaction}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Total: {clienteTransactions.length} transações
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
