'use client'

import { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  XCircle,
  Phone,
  PhoneOff,
  Mail,
  Printer,
  MapPin,
  MessageCircle,
  Ticket,
  MessageSquare,
  ImageOff,
} from 'lucide-react'
import { type Order, type OrderItem } from '@/types/order'
import { cn } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import {
  getStatusMeta,
  getInitials,
  itemsCount,
  itemsWord,
  dateFull,
  relativeTime,
  formatPrice,
} from '@/lib/orderVendorMeta'
import {
  formatWhatsAppNumber,
  generateWhatsAppMessage,
  parseDeliveryAddress,
} from '@/lib/orderPanelUtils'
import { OrderVendorTimeline } from './OrderVendorTimeline'

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Primeira imagem do item — tolera images como array OU objeto chaveado por cor. */
function getProductImage(item: OrderItem): string | null {
  const images = item.product.images as unknown
  if (images && typeof images === 'object' && !Array.isArray(images)) {
    const byColor = images as Record<string, string[]>
    if (item.color && Array.isArray(byColor[item.color]) && byColor[item.color].length > 0) {
      return byColor[item.color][0]
    }
    const firstColor = Object.keys(byColor)[0]
    if (firstColor && Array.isArray(byColor[firstColor]) && byColor[firstColor].length > 0) {
      return byColor[firstColor][0]
    }
  }
  if (Array.isArray(images) && images.length > 0) return images[0]
  return null
}

/** Endereço de entrega em uma linha legível. */
function formatAddressLine(order: Order): string | null {
  const addr = parseDeliveryAddress(order)
  if (addr) {
    const street = [addr.street, addr.number].filter(Boolean).join(', ')
    const parts = [
      street || null,
      addr.complement || null,
      addr.neighborhood || null,
      addr.city && addr.state ? `${addr.city} - ${addr.state}` : addr.city || addr.state || null,
      addr.zipcode ? `CEP ${addr.zipcode}` : null,
    ].filter(Boolean)
    if (parts.length > 0) return parts.join(' · ')
  }
  return order.delivery_address && !addr ? order.delivery_address : null
}

// ─── CopyButton (26px, design do drawer) ──────────────────────────────────────
function CopyButton({ value, title }: { value: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      title={title ?? `Copiar ${value}`}
      className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[7px] border border-nxborder bg-white transition-colors hover:bg-nxbg"
    >
      {copied ? <Check size={13} className="text-nxs" /> : <Copy size={13} className="text-nxi3" />}
    </button>
  )
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
type TabKey = 'resumo' | 'itens' | 'cliente' | 'hist'

const TABS: { id: TabKey; label: string }[] = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'itens', label: 'Itens' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'hist', label: 'Histórico' },
]

// ─── Resumo ──────────────────────────────────────────────────────────────────
function ResumoBody({ order }: { order: Order }) {
  const total = parseFloat(order.total || '0')
  const discount = order.coupon_discount ? parseFloat(order.coupon_discount) : 0
  const hasCoupon = !!order.coupon_code
  const subtotal = hasCoupon && discount > 0 ? total + discount : total
  const count = itemsCount(order)

  return (
    <>
      {/* Card total */}
      <div className="rounded-[14px] border border-nxborder bg-nxsurf p-[16px]">
        <div className="text-[12px] font-bold text-nxi3">Total do pedido</div>
        <div className="mt-[4px] flex items-baseline gap-[10px]">
          {hasCoupon && (
            <span className="text-[15px] font-bold text-nxi3 line-through tabular-nums">
              {formatPrice(subtotal)}
            </span>
          )}
          <span className="text-[30px] font-extrabold tracking-[-.03em] text-nxi1 tabular-nums">
            {formatPrice(total)}
          </span>
          <span className="text-[12.5px] font-bold text-nxi3">
            · {count} {itemsWord(count)}
          </span>
        </div>

        {hasCoupon && (
          <div className="mt-[12px] flex flex-col gap-[6px] border-t border-dashed border-nxborder pt-[12px] text-[12.5px] font-bold">
            <div className="flex justify-between text-nxi2">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#2E6B4E]">
              <span className="inline-flex items-center gap-[5px]">
                <Ticket size={13} className="text-[#2E6B4E]" />
                Cupom {order.coupon_code}
              </span>
              <span className="tabular-nums">− {formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-nxi1">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Observação */}
      {order.notes ? (
        <div className="mt-[12px] rounded-[13px] border border-[#F0DCA8] bg-[#FBF3E0] px-[14px] py-[13px]">
          <div className="flex items-center gap-[7px] text-[12px] font-extrabold text-[#8A6516]">
            <MessageSquare size={14} className="text-[#8A6516]" />
            Observação do cliente
          </div>
          <div className="mt-[6px] text-[12.5px] font-semibold leading-[1.45] text-[#6E531A]">
            {order.notes}
          </div>
        </div>
      ) : (
        <div className="mt-[12px] p-[8px] text-center text-[12px] font-semibold text-nxi3">
          Sem observações do cliente.
        </div>
      )}
    </>
  )
}

// ─── Itens ───────────────────────────────────────────────────────────────────
function ItensBody({ order }: { order: Order }) {
  const total = parseFloat(order.total || '0')
  const discount = order.coupon_discount ? parseFloat(order.coupon_discount) : 0
  const hasCoupon = !!order.coupon_code
  const subtotal = hasCoupon && discount > 0 ? total + discount : total

  return (
    <>
      <div className="flex flex-col gap-[10px]">
        {order.items.map((item) => {
          const imageUrl = getProductImage(item)
          const unit = parseFloat(item.price || '0')
          const lineTotal = unit * item.quantity
          return (
            <div
              key={item.id}
              className="flex gap-[12px] rounded-[13px] border border-nxborder bg-white p-[12px]"
            >
              {/* Thumb + badge */}
              <div className="relative h-[58px] w-[58px] flex-none">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={buildImageUrl(imageUrl)}
                    alt={item.product.name}
                    className="h-[58px] w-[58px] rounded-[10px] border border-nxborder object-cover"
                  />
                ) : (
                  <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-nxborder bg-[#FAFAFC]">
                    <ImageOff size={18} className="text-[#B7B9C6]" />
                  </div>
                )}
                <span className="absolute -right-[6px] -top-[6px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-nxp px-[5px] text-[11px] font-extrabold tabular-nums text-white shadow-[0_0_0_2px_#fff]">
                  {item.quantity}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-extrabold text-nxi1">{item.product.name}</div>
                {(item.size || item.color) && (
                  <div className="mt-[5px] flex flex-wrap gap-[5px]">
                    {item.size && (
                      <span className="rounded-[6px] bg-nxbg px-[7px] py-[1px] text-[10.5px] font-bold text-nxi2">
                        Tam {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="rounded-[6px] bg-nxbg px-[7px] py-[1px] text-[10.5px] font-bold text-nxi2">
                        {item.color}
                      </span>
                    )}
                  </div>
                )}
                {item.notes && (
                  <div className="mt-[6px] rounded-[8px] bg-[#FBF3E0] px-[8px] py-[6px] text-[11px] font-semibold leading-[1.4] text-[#6E531A]">
                    {item.notes}
                  </div>
                )}
              </div>

              {/* Valores */}
              <div className="flex-none text-right">
                <div className="text-[13px] font-extrabold text-nxi1 tabular-nums">
                  {formatPrice(lineTotal)}
                </div>
                <div className="text-[11px] font-semibold text-nxi3 tabular-nums">
                  {formatPrice(unit)} un.
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Totais */}
      <div className="mt-[12px] flex flex-col gap-[6px] rounded-[13px] border border-nxborder bg-nxsurf p-[14px] text-[12.5px] font-bold">
        <div className="flex justify-between text-nxi2">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        {hasCoupon && (
          <div className="flex justify-between text-[#2E6B4E]">
            <span>Desconto ({order.coupon_code})</span>
            <span className="tabular-nums">− {formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-dashed border-nxborder pt-[6px] text-[14px] font-extrabold text-nxi1">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
      </div>
    </>
  )
}

// ─── Cliente ─────────────────────────────────────────────────────────────────
function ClienteBody({ order, onPrint }: { order: Order; onPrint?: () => void }) {
  const hasPhone = !!order.customer_phone
  const whatsappNumber = hasPhone ? formatWhatsAppNumber(order.customer_phone) : null
  const whatsappMessage = generateWhatsAppMessage(order)
  const addressLine = formatAddressLine(order)

  return (
    <>
      {/* Card avatar */}
      <div className="flex items-center gap-[12px] rounded-[13px] border border-nxborder bg-nxsurf p-[14px]">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#DADCEC] text-[16px] font-extrabold text-nxp">
          {getInitials(order.customer_name)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-extrabold text-nxi1">{order.customer_name}</div>
          <div className="text-[12px] font-semibold text-nxi3">
            Pedido #{order.order_code} · {relativeTime(order.created_at)}
          </div>
        </div>
      </div>

      {/* Contatos */}
      <div className="mt-[11px] flex flex-col gap-[8px]">
        {hasPhone ? (
          <div className="flex items-center gap-[10px] rounded-[12px] border border-nxborder bg-white px-[13px] py-[11px]">
            <Phone size={15} className="text-nxi3" />
            <span className="text-[13px] font-bold text-nxi1 tabular-nums">
              {order.customer_phone}
            </span>
            <div className="ml-auto">
              <CopyButton value={order.customer_phone} title="Copiar telefone" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-[10px] rounded-[12px] border-[1.5px] border-dashed border-nxborder bg-[#FAFAFC] px-[13px] py-[11px]">
            <PhoneOff size={15} className="text-[#B7B9C6]" />
            <span className="text-[13px] font-bold text-nxi3">Sem telefone cadastrado</span>
          </div>
        )}
        <div className="flex items-center gap-[10px] rounded-[12px] border border-nxborder bg-white px-[13px] py-[11px]">
          <Mail size={15} className="text-nxi3" />
          <span className="min-w-0 truncate text-[13px] font-bold text-nxi1">
            {order.customer_email}
          </span>
          <div className="ml-auto">
            <CopyButton value={order.customer_email} title="Copiar e-mail" />
          </div>
        </div>
      </div>

      {/* Ações 2x2 */}
      <div className="mt-[11px] grid grid-cols-2 gap-[8px]">
        {whatsappNumber ? (
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[42px] items-center justify-center gap-[7px] rounded-[11px] bg-nxs text-[13px] font-extrabold text-white transition-colors hover:bg-nxs/90"
          >
            <MessageCircle size={16} className="text-white" />
            WhatsApp
          </a>
        ) : (
          <span className="flex h-[42px] cursor-not-allowed items-center justify-center gap-[7px] rounded-[11px] border border-nxborder bg-nxbg text-[13px] font-extrabold text-[#B7B9C6]">
            <MessageCircle size={16} className="text-[#B7B9C6]" />
            WhatsApp
          </span>
        )}
        {hasPhone ? (
          <a
            href={`tel:${order.customer_phone}`}
            className="flex h-[42px] items-center justify-center gap-[7px] rounded-[11px] border border-nxborder bg-white text-[13px] font-extrabold text-nxi2 transition-colors hover:bg-nxbg"
          >
            <Phone size={15} className="text-nxi3" />
            Ligar
          </a>
        ) : (
          <span className="flex h-[42px] cursor-not-allowed items-center justify-center gap-[7px] rounded-[11px] border border-nxborder bg-nxbg text-[13px] font-extrabold text-[#B7B9C6]">
            <Phone size={15} className="text-[#B7B9C6]" />
            Ligar
          </span>
        )}
        <a
          href={`mailto:${order.customer_email}?subject=Pedido ${order.order_code}`}
          className="flex h-[42px] items-center justify-center gap-[7px] rounded-[11px] border border-nxborder bg-white text-[13px] font-extrabold text-nxi2 transition-colors hover:bg-nxbg"
        >
          <Mail size={15} className="text-nxi3" />
          E-mail
        </a>
        <button
          type="button"
          onClick={onPrint}
          className="flex h-[42px] items-center justify-center gap-[7px] rounded-[11px] border border-nxborder bg-white text-[13px] font-extrabold text-nxi2 transition-colors hover:bg-nxbg"
        >
          <Printer size={15} className="text-nxi3" />
          Imprimir
        </button>
      </div>

      {/* Endereço */}
      <div className="mt-[13px] text-[12px] font-extrabold uppercase tracking-[.04em] text-nxi3">
        Endereço de entrega
      </div>
      {addressLine ? (
        <div className="mt-[7px] flex gap-[10px] rounded-[12px] border border-nxborder bg-white px-[13px] py-[12px]">
          <MapPin size={15} className="flex-none text-nxi3" />
          <span className="text-[12.5px] font-semibold leading-[1.5] text-nxi2">{addressLine}</span>
        </div>
      ) : (
        <div className="mt-[7px] rounded-[12px] border-[1.5px] border-dashed border-nxborder bg-[#FAFAFC] p-[18px] text-center text-[12.5px] font-bold text-nxi3">
          Endereço não informado (retirada na loja)
        </div>
      )}
    </>
  )
}

// ─── Histórico ───────────────────────────────────────────────────────────────
function HistoricoBody({ order }: { order: Order }) {
  return (
    <>
      {order.status === 5 && (
        <div className="mb-[14px] rounded-[13px] border border-[#F3C8D4] bg-[#FBE9EE] px-[14px] py-[13px]">
          <div className="flex items-center gap-[8px] text-[13px] font-extrabold text-[#A82F4F]">
            <XCircle size={15} className="text-[#A82F4F]" />
            Pedido cancelado
          </div>
          <div className="mt-[6px] text-[12.5px] font-semibold leading-[1.45] text-[#8A3350]">
            {order.cancellation_reason || 'Motivo não informado.'}
          </div>
        </div>
      )}
      <OrderVendorTimeline order={order} />
    </>
  )
}

// ─── Painel ──────────────────────────────────────────────────────────────────
interface OrderDetailPanelProps {
  order: Order
  /** Se vier, renderiza o X no header (desktop). */
  onClose?: () => void
  cancelReqLoading?: boolean
  onAcceptCancelReq?: () => void
  onDenyCancelReq?: () => void
  onPrint?: () => void
}

export function OrderDetailPanel({
  order,
  onClose,
  cancelReqLoading,
  onAcceptCancelReq,
  onDenyCancelReq,
  onPrint,
}: OrderDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumo')
  const [copied, setCopied] = useState(false)

  const meta = getStatusMeta(order.status)
  const hasCancelReq = order.cancellation_requested === 1

  const copyCode = () => {
    navigator.clipboard.writeText(order.order_code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="border-b border-nxborder px-[20px] pb-[14px] pt-[18px]">
        <div className="flex items-center gap-[10px]">
          <span
            className={cn(
              'inline-flex items-center gap-[6px] rounded-[8px] py-[3px] pl-[8px] pr-[9px] text-[11.5px] font-extrabold',
              meta.badge,
            )}
          >
            <span className={cn('h-[6px] w-[6px] rounded-full', meta.dot)} />
            {meta.label}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-[32px] w-[32px] items-center justify-center rounded-[9px] border border-nxborder bg-white transition-colors hover:bg-nxbg"
            >
              <X size={17} className="text-nxi2" />
            </button>
          )}
        </div>

        <div className="mt-[13px] flex items-center gap-[8px]">
          <span className="text-[16px] font-extrabold tracking-[.02em] text-nxi1 tabular-nums">
            #{order.order_code}
          </span>
          <button
            type="button"
            onClick={copyCode}
            title="Copiar código do pedido"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-nxborder bg-white transition-colors hover:bg-nxbg"
          >
            {copied ? (
              <Check size={13} className="text-nxs" />
            ) : (
              <Copy size={13} className="text-nxi3" />
            )}
          </button>
          <span className="ml-auto text-[12px] font-semibold text-nxi3">
            {dateFull(order.created_at)} · {relativeTime(order.created_at)}
          </span>
        </div>

        <div className="mt-[7px] text-[20px] font-extrabold tracking-[-.02em] text-nxi1">
          {order.customer_name}
        </div>
      </div>

      {/* ─── Alerta de cancelamento ───────────────────────────────────────── */}
      {hasCancelReq && (
        <div className="mx-[16px] mt-[14px] rounded-[13px] border border-[#F2D2BE] bg-[#FBEEE6] px-[14px] py-[13px]">
          <div className="flex items-center gap-[8px] text-[13px] font-extrabold text-[#B5491D]">
            <AlertTriangle size={15} className="text-[#B5491D]" />
            Cliente pediu cancelamento
          </div>
          <div className="mt-[6px] text-[12.5px] font-semibold leading-[1.45] text-[#7A4527]">
            “{order.cancellation_request_reason}”
          </div>
          <div className="mt-[11px] flex gap-[8px]">
            <button
              type="button"
              onClick={onAcceptCancelReq}
              disabled={cancelReqLoading}
              className="flex h-[36px] flex-1 items-center justify-center gap-[6px] rounded-[10px] bg-nxd text-[12.5px] font-extrabold text-white transition-colors hover:bg-nxd/90 disabled:cursor-not-allowed"
            >
              {cancelReqLoading && <Loader2 size={14} className="animate-spin" />}
              Aceitar e cancelar
            </button>
            <button
              type="button"
              onClick={onDenyCancelReq}
              disabled={cancelReqLoading}
              className="h-[36px] flex-1 rounded-[10px] border border-[#E2C3AE] bg-white text-[12.5px] font-extrabold text-[#8A5733] transition-colors hover:bg-[#FBEEE6] disabled:cursor-not-allowed"
            >
              Recusar
            </button>
          </div>
        </div>
      )}

      {/* ─── Tabs (pílula) ────────────────────────────────────────────────── */}
      <div className="flex gap-[4px] px-[16px] pt-[14px]">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'h-[34px] flex-1 rounded-[9px] text-[13px] font-extrabold transition-colors',
                active ? 'bg-[#EEF0FB] text-nxp' : 'text-nxi3 hover:text-nxi2',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── Corpo (scroll) ───────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-auto p-[16px]">
        {activeTab === 'resumo' && <ResumoBody order={order} />}
        {activeTab === 'itens' && <ItensBody order={order} />}
        {activeTab === 'cliente' && <ClienteBody order={order} onPrint={onPrint} />}
        {activeTab === 'hist' && <HistoricoBody order={order} />}
      </div>
    </>
  )
}
