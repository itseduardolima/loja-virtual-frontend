'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageCircle, 
  Calendar,
  User,
  Phone,
  Mail,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { ORDER_STATUS, SORT_OPTIONS, type Order, type OrdersFilters } from '@/types/order'
import { formatPrice } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorState } from '@/components/ErrorState'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [filters, setFilters] = useState<OrdersFilters>({
    page: 1,
    limit: 10,
    sort: 'DATE_DESC'
  })

  const { data, isLoading, error } = useOrders(filters)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.profile !== 'Vendedor') {
      router.push('/')
    }
  }, [isAuthenticated, user, router])

  const handleFilterChange = (key: keyof OrdersFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getStatusInfo = (status: number) => {
    return ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
  }

  const getStatusIcon = (status: number) => {
    const statusInfo = getStatusInfo(status)
    switch (statusInfo.icon) {
      case 'clock': return <Clock className="h-4 w-4" />
      case 'check-circle': return <CheckCircle className="h-4 w-4" />
      case 'truck': return <Truck className="h-4 w-4" />
      case 'x-circle': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated || user?.profile !== 'Vendedor') {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState 
          message="Erro ao carregar pedidos"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const orders = data?.data || []
  const meta = data?.meta

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os pedidos da sua loja
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Busca */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cliente ou código do pedido"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={filters.status?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {Object.entries(ORDER_STATUS).map(([key, status]) => (
                      <SelectItem key={key} value={key}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ordenar por</label>
                <Select
                  value={filters.sort || 'DATE_DESC'}
                  onValueChange={(value) => handleFilterChange('sort', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Itens por página */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Itens por página</label>
                <Select
                  value={filters.limit?.toString() || '10'}
                  onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pedidos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Pedidos ({meta?.total || 0})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600">
                  Não há pedidos que correspondam aos filtros selecionados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              #{order.order_number}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`${
                                getStatusInfo(order.status).color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                getStatusInfo(order.status).color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                getStatusInfo(order.status).color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getStatusInfo(order.status).label}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Código: {order.order_code}
                          </p>
                          <p className="text-sm text-gray-500">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(parseFloat(order.total))}
                          </p>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {order.customer_name}
                          </span>
                        </div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {order.customer_phone}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.customer_email}
                          </span>
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Itens ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                      src={buildImageUrl(item.product.images[0])}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.product.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    {item.size && <span>Tamanho: {item.size}</span>}
                                    {item.color && <span>Cor: {item.color}</span>}
                                    <span>Qtd: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatPrice(parseFloat(item.price))}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Observações */}
                      {order.notes && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Observações:</strong> {order.notes}
                          </p>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          {order.whatsapp_sent ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              WhatsApp enviado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              WhatsApp não enviado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalhes
                          </Button>
                          <Button size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.currentPage - 1)}
                disabled={meta.currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {meta.currentPage} de {meta.lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.currentPage + 1)}
                disabled={meta.currentPage === meta.lastPage}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
