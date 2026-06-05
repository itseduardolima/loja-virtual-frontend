import { formatPrice } from './utils'
import type { Order } from '@/types/order'

export const STATUS_ORDER: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5]

/** Fluxo de status: só permite avançar para o próximo ou cancelar (quando aplicável). */
export const STATUS_FLOW: Record<number, number[]> = {
  1: [2, 5], // Pendente → Confirmado ou Cancelado
  2: [3, 5], // Confirmado → Enviado ou Cancelado
  3: [4, 5], // Enviado → Entregue ou Cancelado
  4: [],     // Entregue = final
  5: [],     // Cancelado = final
}

export const STATUS_OPTIONS: { value: number; label: string; description: string }[] = [
  { value: 1, label: 'Pendente',   description: 'Aguardando pagamento' },
  { value: 2, label: 'Confirmado', description: 'Pagamento confirmado' },
  { value: 3, label: 'Enviado',    description: 'Pedido enviado para entrega' },
  { value: 4, label: 'Entregue',   description: 'Pedido entregue ao cliente' },
  { value: 5, label: 'Cancelado',  description: 'Pedido cancelado' },
]

/** Mesmo padrão de cores do ORDER_STATUS (detalhes do pedido): yellow, blue, purple, green, red */
export const STATUS_HEADER_COLORS: Record<
  number,
  { bg: string; badge: string; icon: string; selectedRow: string }
> = {
  1: {
    bg: 'bg-yellow-100 hover:bg-yellow-200/80',
    badge: 'bg-yellow-200/90 text-yellow-900',
    icon: 'text-yellow-700',
    selectedRow: 'bg-yellow-50 hover:bg-yellow-50',
  },
  2: {
    bg: 'bg-blue-100 hover:bg-blue-200/80',
    badge: 'bg-blue-200/90 text-blue-900',
    icon: 'text-blue-700',
    selectedRow: 'bg-blue-50 hover:bg-blue-50',
  },
  3: {
    bg: 'bg-purple-100 hover:bg-purple-200/80',
    badge: 'bg-purple-200/90 text-purple-900',
    icon: 'text-purple-700',
    selectedRow: 'bg-purple-50 hover:bg-purple-50',
  },
  4: {
    bg: 'bg-green-100 hover:bg-green-200/80',
    badge: 'bg-green-200/90 text-green-900',
    icon: 'text-green-700',
    selectedRow: 'bg-green-50 hover:bg-green-50',
  },
  5: {
    bg: 'bg-red-100 hover:bg-red-200/80',
    badge: 'bg-red-200/90 text-red-900',
    icon: 'text-red-700',
    selectedRow: 'bg-red-50 hover:bg-red-50',
  },
}

// ─── Domain helpers (moved from OrderDetailPanel) ─────────────────────────────

/** Formata um número de telefone para o formato internacional do WhatsApp (55...). */
export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
}

/** Gera a mensagem de confirmação de pedido para WhatsApp (URL-encoded). */
export function generateWhatsAppMessage(order: Order): string {
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

/** Faz parse do JSON de endereço de entrega. Retorna null se ausente ou inválido. */
export function parseDeliveryAddress(order: Order): Record<string, string> | null {
  if (!order.delivery_address) return null
  try {
    return JSON.parse(order.delivery_address)
  } catch {
    return null
  }
}

/** Tempo relativo legível (ex: "há 5 min", "há 2 dias"). Semântica específica do painel de pedidos. */
export function relativeTimeOrder(date: string): string {
  const d = new Date(date)
  const diffMs = Date.now() - d.getTime()
  const min = Math.floor(diffMs / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const days = Math.floor(h / 24)
  if (days < 7) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
