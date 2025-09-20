'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  MessageCircle,
  CreditCard,
  FileText,
  ShoppingBag
} from 'lucide-react'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { ORDER_STATUS, type Order } from '@/types/order'
import { formatPrice } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorState } from '@/components/ErrorState'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const orderId = parseInt(params.id as string)

  const { data: order, isLoading, error } = useOrderDetail(orderId)

  // Redirecionar se não estiver logado ou não for vendedor
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.profile !== 'Vendedor') {
      router.push('/')
    }
  }, [isAuthenticated, user, router])

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

  const formatWhatsAppNumber = (phone: string) => {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')
    // Adiciona o código do país se não tiver
    return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  }

  const generateWhatsAppMessage = (order: Order) => {
    const message = `*Olá ${order.customer_name}!* 👋

Seu pedido foi recebido com sucesso!

*Valor Total:* ${formatPrice(parseFloat(order.total))}

*Itens do Pedido:*
${order.items.map(item => 
  `• ${item.product.name} - Tamanho: ${item.size} - Cor: ${item.color} - Qtd: ${item.quantity} - ${formatPrice(parseFloat(item.price))}`
).join('\n')}


Em breve entraremos em contato para confirmar o pedido! 🛍️`
    
    return encodeURIComponent(message)
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

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState 
          message="Erro ao carregar detalhes do pedido"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const whatsappNumber = order.customer_phone ? formatWhatsAppNumber(order.customer_phone) : null
  const whatsappMessage = generateWhatsAppMessage(order)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/vendedor/pedidos')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pedido #{order.order_number}
              </h1>
              <p className="text-gray-600 mt-1">
                Código: {order.order_code}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`py-4 px-6 text-base ${
                statusInfo.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                statusInfo.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                statusInfo.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {getStatusIcon(order.status)}
              <span className="ml-1">{statusInfo.label}</span>
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{order.customer_name}</span>
                    </div>
                    {order.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{order.customer_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{order.customer_email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(parseFloat(order.total))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itens do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Itens do Pedido ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={buildImageUrl(item.product.images[0])}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          {item.size && <span>Tamanho: {item.size}</span>}
                          {item.color && <span>Cor: {item.color}</span>}
                          <span>Quantidade: {item.quantity}</span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            Observação: {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(parseFloat(item.price))}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(parseFloat(item.product.price))} cada
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(parseFloat(order.total))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-medium">Grátis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {whatsappNumber && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-70 text-white"
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
                      window.open(whatsappUrl, '_blank')
                    }}
                  >
                    <img className='mr-2' width="24" height="20" src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp--v1" />
                    Chamar no WhatsApp
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Atualizar Status
                </Button>
                
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Imprimir Pedido
                </Button>
              </CardContent>
            </Card>

            {/* Status do WhatsApp */}
            <Card>
              <CardHeader>
                <CardTitle>Status do WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {order.whatsapp_sent ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">Mensagem enviada</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-700">WhatsApp não enviado</span>
                    </>
                  )}
                </div>
                {order.whatsapp_sent_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Enviado em: {formatDate(order.whatsapp_sent_at)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
