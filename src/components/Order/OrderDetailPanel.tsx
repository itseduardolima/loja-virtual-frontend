'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Phone,
  Mail,
  Package,
  FileText,
  ShoppingBag,
  MapPin,
  PhoneCall,
  Tag,
  Printer,
  CheckCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { type Order } from '@/types/order'
import { formatDate, formatPrice } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { OrderTrackingTimeline } from '@/components/Order/OrderTrackingTimeline'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { OrderPrintModal } from '@/components/Order/OrderPrintModal'

function renderDeliveryAddress(order: Order) {
  let deliveryAddr: Record<string, string> | null = null
  if (order.delivery_address) {
    try { deliveryAddr = JSON.parse(order.delivery_address) } catch { /* */ }
  }

  const cardHeader = (
    <CardHeader className="py-2 px-3">
      <CardTitle className="flex items-center gap-2 text-sm font-bold">
        <MapPin className="h-4 w-4 shrink-0" />
        Endereço de entrega
      </CardTitle>
    </CardHeader>
  )

  if (deliveryAddr) {
    const { name, street, number, complement, neighborhood, city, state, zipcode } = deliveryAddr
    return (
      <Card>
        {cardHeader}
        <CardContent className="py-2 px-3 pb-3 space-y-0.5 text-sm text-gray-700 break-words">
          {name && <p className="font-medium text-gray-900">{name}</p>}
          {street && (
            <p>
              {street}
              {number ? `, ${number}` : ''}
              {complement ? ` - ${complement}` : ''}
            </p>
          )}
          {(neighborhood || city || state) && (
            <p>
              {[neighborhood, city, state].filter(Boolean).join(', ')}
              {zipcode ? ` - ${zipcode}` : ''}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {cardHeader}
      <CardContent className="py-2 px-3 pb-3">
        <p className="text-gray-500 text-xs">Endereço não informado pelo comprador</p>
      </CardContent>
    </Card>
  )
}

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

Em breve entraremos em contato para confirmar o pedido!`
  return encodeURIComponent(message)
}

interface OrderDetailPanelProps {
  orderId: number | null
  onStatusUpdate?: () => void
}

export function OrderDetailPanel({ orderId, onStatusUpdate }: OrderDetailPanelProps) {
  const { data: order, isLoading, error } = useOrderDetail(orderId ?? 0)
  const [isPrintOpen, setIsPrintOpen] = useState(false)


  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 min-w-0">
        <div className="animate-pulse flex flex-col gap-3 w-full">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-red-50/50 rounded-xl border border-dashed border-red-200 min-w-0">
        <p className="text-red-600 font-bold text-sm">Erro ao carregar o pedido</p>
        <p className="text-xs text-red-500 mt-1">Tente selecionar novamente</p>
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
    <div className="h-full overflow-y-auto space-y-4 min-w-0">
      {/* Cabeçalho do pedido */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900 truncate" title={order.customer_name}>
          {order.customer_name}
        </h2>
      </div>

      <div className="text-sm text-gray-600 break-words flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p>Pedido <span className="font-bold text-gray-900">#{order.order_code}</span></p>
          {order.bling_sync?.status === 'synced' && (
            <Badge variant="outline" className="gap-1 text-green-700 border-green-200 bg-green-50 text-xs">
              <CheckCircle className="h-3 w-3" />
              Bling
            </Badge>
          )}
        </div>
        <p>Feito às <span className="font-bold text-gray-900">{formatDate(order.created_at)}</span></p>
      </div>

      {/* Contato rápido */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleWhatsappContact} disabled={!whatsappNumber} className="gap-1.5 flex-1 min-w-0 sm:flex-initial">
          <span className="h-4 w-4 shrink-0 flex items-center justify-center">
            <WhatsappIcon />
          </span>
          <span className="truncate">WhatsApp</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleCallContact} disabled={!order.customer_phone} className="gap-1.5 flex-1 min-w-0 sm:flex-initial">
          <PhoneCall className="h-4 w-4 shrink-0" />
          <span className="truncate">Ligar</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmailContact} className="gap-1.5 flex-1 min-w-0 sm:flex-initial">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">Email</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsPrintOpen(true)} className="gap-1.5 flex-1 min-w-0 sm:flex-initial">
          <Printer className="h-4 w-4 shrink-0" />
          <span className="truncate">Imprimir</span>
        </Button>
      </div>

      {/* Itens */}
      <Card>
        <CardHeader className="py-2 px-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ShoppingBag className="h-4 w-4 shrink-0" />
            Itens no pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3 pb-3 space-y-3">
          {order.items.map((item) => {
            const imageUrl = getProductImage(item)
            return (
              <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-gray-100 p-2.5 min-w-0">
                <div className="flex gap-2 min-w-0">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                    {imageUrl ? (
                      <img src={buildImageUrl(imageUrl)} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm leading-tight break-words">{item.product.name}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5 text-xs text-gray-500">
                      {item.size && <span>{item.size}</span>}
                      {item.color && <span>· {item.color}</span>}
                      <span>· Qtd: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                {item.notes && (
                  <p className="text-xs text-amber-700 break-words">Obs: {item.notes}</p>
                )}
                <p className="text-sm font-bold text-gray-900 text-right">
                  {formatPrice(parseFloat(item.price) * item.quantity)}
                </p>
              </div>
            )
          })}
          
        </CardContent>
      </Card>

      {/* Cupom + Total */}
      <Card>
        <CardContent className="py-3 px-3 space-y-2">
          {/* Subtotal */}
          {order.coupon_discount && parseFloat(order.coupon_discount) > 0 && (
            <>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Subtotal</span>
                <span>
                  {formatPrice(parseFloat(order.total) + parseFloat(order.coupon_discount))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1.5 text-green-700 font-medium">
                  <Tag className="h-3.5 w-3.5" />
                  {order.coupon_code ?? 'Cupom'}
                </span>
                <span className="text-green-700 font-medium">
                  -{formatPrice(parseFloat(order.coupon_discount))}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2" />
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-900 font-bold">Total</span>
            <span className="text-base font-bold text-gray-900">{formatPrice(parseFloat(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Endereço de entrega */}
      {renderDeliveryAddress(order)}

      {/* Observações */}
      {order.notes && (
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <FileText className="h-4 w-4 shrink-0" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-3 pb-3">
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 break-words">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Progresso */}
      <Card>
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-bold">Progresso do pedido</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3 pb-3">
          <OrderTrackingTimeline currentStatus={order.status} orderId={order.id} showTitle={false} isVendor />
        </CardContent>
      </Card>

      {/* Cliente / Contato */}
      <Card>
        <CardHeader className="py-2 px-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <User className="h-4 w-4 shrink-0" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3 pb-3 space-y-2 text-sm min-w-0">
          {order.customer_phone && (
            <div className="flex items-center gap-2 text-gray-700 min-w-0">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="break-all min-w-0">{order.customer_phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700 min-w-0">
            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="break-all min-w-0">{order.customer_email}</span>
          </div>
        </CardContent>
      </Card>

      <OrderPrintModal
        order={order}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  )
}
