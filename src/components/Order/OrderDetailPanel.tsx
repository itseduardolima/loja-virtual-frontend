'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Phone,
  Mail,
  Package,
  FileText,
  ShoppingBag,

  PhoneCall,

} from 'lucide-react'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { ORDER_STATUS, type Order } from '@/types/order'
import { formatDate, formatPrice } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { UpdateOrderStatusModal } from '@/components/Order/UpdateOrderStatusModal'
import { OrderTrackingTimeline } from '@/components/Order/OrderTrackingTimeline'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

function getProductImage(item: Order['items'][0]): string | null {
  const images = item.product.images
  if (images && typeof images === 'object' && !Array.isArray(images)) {
    if (item.color && images[item.color] && Array.isArray(images[item.color]) && (images[item.color] as string[]).length > 0) {
      return (images[item.color] as string[])[0]
    }
    const firstColor = Object.keys(images)[0]
    if (firstColor && Array.isArray(images[firstColor]) && (images[firstColor] as string[]).length > 0) {
      return (images[firstColor] as string[])[0]
    }
  }
  if (Array.isArray(images) && images.length > 0) return images[0]
  return null
}

function formatWhatsAppNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
}

function generateWhatsAppMessage(order: Order) {
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

interface OrderDetailPanelProps {
  orderId: number | null
  onStatusUpdate?: () => void
}

export function OrderDetailPanel({ orderId, onStatusUpdate }: OrderDetailPanelProps) {
  const { data: order, isLoading, error } = useOrderDetail(orderId ?? 0)

  if (orderId === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 font-bold">Selecione um pedido</p>
        <p className="text-base text-gray-400 mt-1">Clique em um pedido na lista para ver os detalhes</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-sm">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg5gray-200 rounded w-full" />
          <div className="h-5 bg5gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-red-50/50 rounded-2xl border border-dashed border-red-200">
        <p className="text-red-600 font-bold">Erro ao carregar o pedido</p>
        <p className="text-base text-red-500 mt-1">Tente selecionar novamente</p>
      </div>
    )
  }

  const whatsappNumber = order.customer_phone ? formatWhatsAppNumber(order.customer_phone) : null
  const whatsappMessage = generateWhatsAppMessage(order)

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
    <div className="h-full overflow-y-auto space-y-6">
      {/* Cabeçalho do pedido */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{order.customer_name}</h2>
        </div>
        <UpdateOrderStatusModal
          orderId={order.id}
          currentStatus={order.status}
          orderNumber={order.order_number}
        />
      </div>

      <p className="text-base text-gray-600">
        Pedido <span className="font-bold text-gray-900">#{order.order_code}</span> · Feito às <span className="font-bold text-gray-900">{formatDate(order.created_at)}</span>
      </p>

      {/* Contato rápido */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleWhatsappContact} disabled={!whatsappNumber} className="gap-2">
          <WhatsappIcon />
          WhatsApp
        </Button>
        <Button variant="outline" onClick={handleCallContact} disabled={!order.customer_phone} className="gap-2">
          <PhoneCall className="h-4 w-4" />
          Ligar
        </Button>
        <Button variant="outline" onClick={handleEmailContact} className="gap-2">
          <Mail className="h-4 w-5" />
          Email
        </Button>
      </div>


      {/* Cliente */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <User className="h-5 w-5" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 pb-4 space-y-2 text-base">
          {order.customer_phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-5 w-5 text-gray-400" />
              {order.customer_phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="h-5 w-5 text-gray-400" />
            {order.customer_email}
          </div>
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" />
            Itens no pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 pb-4 space-y-3">
          {order.items.map((item) => {
            const imageUrl = getProductImage(item)
            return (
              <div key={item.id} className="flex gap-3 rounded-lg border border-gray-100 p-3">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                  {imageUrl ? (
                    <img src={buildImageUrl(imageUrl)} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-lg">{item.product.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-0.5 text-sm text-gray-500">
                    {item.size && <span>{item.size}</span>}
                    {item.color && <span>· {item.color}</span>}
                    <span>· Qtd: {item.quantity}</span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-amber-700 mt-1">Obs: {item.notes}</p>
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900 shrink-0">
                  {formatPrice(parseFloat(item.price) * item.quantity)}
                </p>
              </div>
            )
          })}
          <div className="flex justify-between text-base pt-2 border-t border-gray-100">
            <span className="text-gray-500 font-bold">Subtotal</span>
            <span className="font-bold text-gray-900">{formatPrice(parseFloat(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Forma de pagamento / Total */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-900 font-bold">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(parseFloat(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      {order.notes && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <FileText className="h-5 w-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4">
            <p className="text-base text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Progresso */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base font-bold">Progresso do pedido</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 pb-4">
          <OrderTrackingTimeline currentStatus={order.status} orderId={order.id} showTitle={false} isVendor />
        </CardContent>
      </Card>


    </div>
  )
}
