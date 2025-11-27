'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {

  User,
  Phone,
  Mail,
  Package,

  FileText,
  ShoppingBag,
  ChevronLeft,
  MessageCircle,
  PhoneCall,
  Send
} from 'lucide-react'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { ORDER_STATUS, type Order } from '@/types/order'
import { formatDate, formatPrice } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { ErrorState } from '@/components/ErrorState'
import { UpdateOrderStatusModal } from '@/components/UpdateOrderStatusModal'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import LoadingPage from '@/components/LoadingPage'


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
        <LoadingPage />
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
  const statusTimeline = [
    { id: 1, title: 'Pedido recebido', description: 'Estamos aguardando a confirmação do pedido.' },
    { id: 2, title: 'Pagamento confirmado', description: 'O pagamento foi identificado e o pedido está em preparo.' },
    { id: 3, title: 'Pedido enviado', description: 'O pedido saiu para entrega.' },
    { id: 4, title: 'Pedido entregue', description: 'O pedido foi entregue ao cliente.' },
    { id: 5, title: 'Pedido cancelado', description: 'O pedido foi cancelado.' }
  ]
  const currentStatusIndex = statusTimeline.findIndex(step => step.id === order.status)
  const totalItemsCount = order.items.reduce((total, item) => total + item.quantity, 0)

  const handleWhatsappContact = () => {
    if (!whatsappNumber) return
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')
  }

  const handleEmailContact = () => {
    window.location.href = `mailto:${order.customer_email}?subject=Pedido ${order.order_code}`
  }

  const handleCallContact = () => {
    if (!order.customer_phone) return
    window.location.href = `tel:${order.customer_phone}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 lg:px-0 space-y-8">

        <div className='flex justify-between'>
          <Button
            variant="ghost"
            onClick={() => router.push('/vendedor/pedidos')}

          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>

          <UpdateOrderStatusModal
            orderId={order.id}
            currentStatus={order.status}
            orderNumber={order.order_number}
          />
        </div>


        {/* Header */}
        <div className="bg-white border border-border shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm  text-secondary-foreground">Detalhes do Pedido</p>

              <p className="text-gray-500 mt-1">Código interno: {order.order_code}</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">

              <Badge
                variant="outline"
                className={`py-2 px-4 text-sm font-semibold rounded-full ${statusInfo.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  statusInfo.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    statusInfo.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      statusInfo.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-700 border-red-200'
                  }`}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-gray-50/80 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Data do pedido</p>
              <p className="text-lg font-semibold text-primary mt-1">{formatDate(order.created_at)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-gray-50/80 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Última atualização</p>
              <p className="text-lg font-semibold text-primary mt-1">{formatDate(order.updated_at)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-gray-50/80 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Itens</p>
              <p className="text-lg font-semibold text-primary mt-1">{totalItemsCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-gray-50/80 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Valor total</p>
              <p className="text-lg font-semibold text-primary mt-1">{formatPrice(parseFloat(order.total))}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-border p-4 bg-gray-50/60 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Nome</p>
                    <p className="text-lg font-medium text-primary">{order.customer_name}</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-gray-50/60 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Contato</p>
                    <div className="space-y-1">
                      {order.customer_phone && (
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {order.customer_phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {order.customer_email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                  Itens do Pedido ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border p-4 md:flex-row md:items-center"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={buildImageUrl(item.product.images[0])}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{item.product.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                        {item.size && <span className="rounded-full bg-border px-3 py-1 text-xs">Tamanho: {item.size}</span>}
                        {item.color && <span className="rounded-full bg-border px-3 py-1 text-xs">Cor: {item.color}</span>}
                        <span className="rounded-full bg-border px-3 py-1 text-xs">Qtd: {item.quantity}</span>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                          Observação: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-base font-bold text-primary">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(parseFloat(item.price))} cada
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {order.notes && (
              <Card className="border-border shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    Observações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 border border-border rounded-2xl p-4">
                    {order.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna adicional */}
          <div className="space-y-6">
            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(parseFloat(order.total))}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="border-t border-dashed pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(parseFloat(order.total))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle>Progresso do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-5">
                    {statusTimeline.map((step, index) => {
                      const isCompleted = index < currentStatusIndex
                      const isCurrent = step.id === order.status
                      const isUpcoming = index > currentStatusIndex

                      return (
                        <div key={step.id} className="flex gap-4 relative">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${isCompleted || isCurrent
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-400 border-gray-200'
                              }`}
                          >
                            <span className="text-[10px] font-semibold">{index + 1}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold ${isCompleted || isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                                {step.title}
                              </p>
                              {isCurrent && (
                                <Badge className="text-xs bg-primary text-white">Status atual</Badge>
                              )}
                            </div>
                            <p className={`text-sm ${isUpcoming ? 'text-gray-400' : 'text-gray-600'}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle>Contato Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleWhatsappContact}
                  disabled={!whatsappNumber}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleCallContact}
                  disabled={!order.customer_phone}
                >
                  <PhoneCall className="h-4 w-4" />
                  Ligar para cliente
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleEmailContact}
                >
                  <Send className="h-4 w-4" />
                  Enviar email
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  )
}
