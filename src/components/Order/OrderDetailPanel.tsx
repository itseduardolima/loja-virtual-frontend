'use client'

import { useState } from 'react'
import {
  Phone,
  Mail,
  Package,
  MapPin,
  Tag,
  Printer,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  Copy,
  Check,
  PhoneCall,
  ArrowRight,
} from 'lucide-react'
import { useOrderDetail } from '@/hooks/useOrderDetail'
import { useAcceptCancellationRequest } from '@/hooks/useAcceptCancellationRequest'
import { useDenyCancellationRequest } from '@/hooks/useDenyCancellationRequest'
import { type Order } from '@/types/order'
import { formatDate, formatPrice, cn } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import { getInitials } from '@/lib/vendor'
import { OrderTrackingTimeline } from './OrderTrackingTimeline'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { OrderPrintModal } from './OrderPrintModal'
import { OrderNfeCard } from './OrderNfeCard'
import {
  STATUS_OPTIONS,
  formatWhatsAppNumber,
  generateWhatsAppMessage,
  parseDeliveryAddress,
  relativeTimeOrder,
} from '@/lib/orderPanelUtils'

// ─── Status chip palette (refined neutral + accent) ──────────────────────────
const STATUS_CHIP: Record<
  number,
  { dot: string; bg: string; text: string; ring: string }
> = {
  1: { dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-800',   ring: 'ring-amber-200' },
  2: { dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-800',    ring: 'ring-blue-200' },
  3: { dot: 'bg-violet-500',  bg: 'bg-violet-50',  text: 'text-violet-800',  ring: 'ring-violet-200' },
  4: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', ring: 'ring-emerald-200' },
  5: { dot: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-800',    ring: 'ring-rose-200' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

// ─── StatusChip ──────────────────────────────────────────────────────────────
function StatusChip({ status, size = 'sm' }: { status: number; size?: 'sm' | 'md' }) {
  const chip = STATUS_CHIP[status] || STATUS_CHIP[1]
  const opt = STATUS_OPTIONS.find((s) => s.value === status)
  const padding = size === 'md' ? 'px-2.5 py-1 text-[12px]' : 'px-2 py-0.5 text-[11px]'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        padding,
        chip.bg,
        chip.text,
        chip.ring,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', chip.dot)} />
      {opt?.label ?? `Status ${status}`}
    </span>
  )
}

// ─── Copy-to-clipboard inline button ─────────────────────────────────────────
function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      title={`Copiar ${label ?? value}`}
      className="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

// ─── Tab definitions ─────────────────────────────────────────────────────────
type TabKey = 'resumo' | 'itens' | 'cliente' | 'historico'

const TABS: Array<{ id: TabKey; label: string; count?: (o: Order) => number | undefined }> = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'itens', label: 'Itens', count: (o) => o.items?.length },
  { id: 'cliente', label: 'Cliente' },
  { id: 'historico', label: 'Histórico' },
]

// ─── Tab: Resumo ─────────────────────────────────────────────────────────────
function ResumoTab({ order }: { order: Order }) {
  const total = parseFloat(order.total)
  const discount = order.coupon_discount ? parseFloat(order.coupon_discount) : 0
  const subtotal = discount > 0 ? total + discount : total

  return (
    <div className="flex flex-col gap-5">
      {/* Hero metric: total */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
            Total do pedido
          </span>
          <span className="text-[11px] font-medium text-gray-400">
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
          <span className="text-[28px] font-extrabold tracking-[-0.03em] text-gray-900">
            {formatPrice(total)}
          </span>
          {discount > 0 && (
            <span className="text-[13px] font-semibold text-gray-400 line-through">
              {formatPrice(subtotal)}
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <Tag className="h-3 w-3" strokeWidth={2.5} />
            {order.coupon_code ?? 'Cupom'}
            <span className="font-bold">−{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      {/* NF-e */}
      <OrderNfeCard order={order} />

      {/* Breakdown financeiro detalhado */}
      {discount > 0 && (
        <section>
          <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
            Composição
          </h4>
          <dl className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <dt className="text-[13px] text-gray-600">Subtotal dos itens</dt>
              <dd className="text-[13px] font-medium tabular-nums text-gray-900">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <dt className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700">
                <Tag className="h-3 w-3" />
                {order.coupon_code ?? 'Desconto'}
              </dt>
              <dd className="text-[13px] font-medium tabular-nums text-emerald-700">
                −{formatPrice(discount)}
              </dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-[13px] font-bold text-gray-900">Total</dt>
              <dd className="text-[14px] font-extrabold tabular-nums text-gray-900">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {/* Observações */}
      {order.notes && (
        <section>
          <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
            Observações do cliente
          </h4>
          <div className="rounded-xl border-l-2 border-amber-300 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-950">
            {order.notes}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Tab: Itens ──────────────────────────────────────────────────────────────
function ItensTab({ order }: { order: Order }) {
  const total = parseFloat(order.total)
  const discount = order.coupon_discount ? parseFloat(order.coupon_discount) : 0
  const subtotal = discount > 0 ? total + discount : total
  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="flex flex-col gap-5">
      <section>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </h4>
          <span className="text-[11px] font-medium text-gray-400 tabular-nums">
            {totalQty} {totalQty === 1 ? 'unidade' : 'unidades'}
          </span>
        </div>

        <ul className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {order.items.map((item, idx) => {
            const imageUrl = getProductImage(item)
            const lineTotal = parseFloat(item.price) * item.quantity
            return (
              <li
                key={item.id}
                className={cn(
                  'group flex gap-3 px-3 py-3 transition-colors hover:bg-gray-50/60',
                  idx > 0 && 'border-t border-gray-100',
                )}
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 ring-1 ring-inset ring-gray-200">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buildImageUrl(imageUrl)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-nxp px-1 text-[10px] font-bold tabular-nums text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)]">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="line-clamp-2 break-words text-[13px] font-semibold leading-tight text-gray-900">
                    {item.product.name}
                  </p>
                  {(item.size || item.color) && (
                    <div className="flex flex-wrap items-center gap-1">
                      {item.size && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-700">
                          Tam {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-700">
                          {item.color}
                        </span>
                      )}
                    </div>
                  )}
                  {item.notes && (
                    <p className="mt-0.5 line-clamp-2 break-words rounded-md border-l-2 border-amber-300 bg-amber-50/60 px-2 py-0.5 text-[11px] leading-snug text-amber-900">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end justify-between text-right">
                  <p className="text-[13px] font-bold tabular-nums text-gray-900">
                    {formatPrice(lineTotal)}
                  </p>
                  <p className="text-[10.5px] font-medium tabular-nums text-gray-400">
                    {formatPrice(parseFloat(item.price))} ea
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Total breakdown */}
      <section>
        <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
          Totais
        </h4>
        <dl className="rounded-xl border border-gray-200 bg-white">
          {discount > 0 && (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <dt className="text-[13px] text-gray-600">Subtotal</dt>
                <dd className="text-[13px] font-medium tabular-nums text-gray-900">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <dt className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700">
                  <Tag className="h-3 w-3" />
                  {order.coupon_code ?? 'Desconto'}
                </dt>
                <dd className="text-[13px] font-medium tabular-nums text-emerald-700">
                  −{formatPrice(discount)}
                </dd>
              </div>
            </>
          )}
          <div className="flex items-baseline justify-between bg-gray-50/50 px-4 py-3">
            <dt className="text-[13px] font-bold text-gray-900">Total</dt>
            <dd className="text-[18px] font-extrabold tracking-[-0.02em] tabular-nums text-gray-900">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

// ─── Tab: Cliente ────────────────────────────────────────────────────────────
function ClienteTab({
  order,
  onPrint,
}: {
  order: Order
  onPrint: () => void
}) {
  const whatsappNumber = order.customer_phone ? formatWhatsAppNumber(order.customer_phone) : null
  const whatsappMessage = generateWhatsAppMessage(order)
  const deliveryAddr = parseDeliveryAddress(order)

  return (
    <div className="flex flex-col gap-5">
      {/* Cliente card */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-nxp to-nxp/70 text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)]">
            {getInitials(order.customer_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold tracking-[-0.005em] text-gray-900">
              {order.customer_name}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono text-[10.5px] text-gray-600">
                #{order.order_code}
              </span>
              <span>·</span>
              <span>{relativeTimeOrder(order.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Contatos como linhas action-able */}
        <div className="divide-y divide-gray-100">
          {order.customer_phone && (
            <a
              href={`tel:${order.customer_phone}`}
              className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <Phone className="h-4 w-4 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-gray-400">
                  Telefone
                </p>
                <p className="truncate text-[13px] font-medium tabular-nums text-gray-900 group-hover:text-gray-700">
                  {order.customer_phone}
                </p>
              </div>
              <CopyButton value={order.customer_phone} label="telefone" />
            </a>
          )}
          <div className="flex items-center gap-3 px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-gray-400">
                Email
              </p>
              <p className="truncate text-[13px] font-medium text-gray-900">
                {order.customer_email}
              </p>
            </div>
            <CopyButton value={order.customer_email} label="email" />
          </div>
        </div>
      </section>

      {/* Quick actions: primary + secondary */}
      <section>
        <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
          Ações rápidas
        </h4>
        <div className="flex flex-col gap-2">
          {/* Primary action — WhatsApp (window.open mantido: link externo) */}
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_hsl(151_55%_30%/0.25)] transition-all hover:bg-emerald-700"
            >
              <span className="inline-flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center">
                  <WhatsappIcon />
                </span>
                Enviar mensagem por WhatsApp
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </a>
          ) : (
            <span className="inline-flex items-center justify-between gap-3 rounded-xl bg-gray-200 px-4 py-2.5 text-[13px] font-semibold text-gray-400 cursor-not-allowed">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center">
                  <WhatsappIcon />
                </span>
                Enviar mensagem por WhatsApp
              </span>
            </span>
          )}

          {/* Secondary actions */}
          <div className="grid grid-cols-3 gap-2">
            {order.customer_phone ? (
              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Ligar
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-gray-400 cursor-not-allowed opacity-40">
                <PhoneCall className="h-3.5 w-3.5" />
                Ligar
              </span>
            )}
            <a
              href={`mailto:${order.customer_email}?subject=Pedido ${order.order_code}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir
            </button>
          </div>
        </div>
      </section>

      {/* Endereço de entrega */}
      <section>
        <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
          Endereço de entrega
        </h4>
        {deliveryAddr ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-start gap-3 px-4 py-3.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1 space-y-0.5 break-words text-[13px] leading-relaxed">
                {deliveryAddr.name && (
                  <p className="font-semibold text-gray-900">{deliveryAddr.name}</p>
                )}
                {deliveryAddr.street && (
                  <p className="text-gray-700">
                    {deliveryAddr.street}
                    {deliveryAddr.number ? `, ${deliveryAddr.number}` : ''}
                    {deliveryAddr.complement ? ` · ${deliveryAddr.complement}` : ''}
                  </p>
                )}
                {(deliveryAddr.neighborhood || deliveryAddr.city || deliveryAddr.state) && (
                  <p className="text-gray-500">
                    {[deliveryAddr.neighborhood, deliveryAddr.city, deliveryAddr.state].filter(Boolean).join(' · ')}
                  </p>
                )}
                {deliveryAddr.zipcode && (
                  <p className="font-mono text-[11.5px] text-gray-400">
                    CEP {deliveryAddr.zipcode}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-4 text-[12.5px] italic text-gray-500">
            <MapPin className="h-4 w-4 shrink-0" />
            Endereço não informado pelo comprador
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Tab: Histórico ──────────────────────────────────────────────────────────
function HistoricoTab({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Motivo de cancelamento (no topo se cancelado) */}
      {order.status === 5 && (
        <section className="overflow-hidden rounded-xl border border-rose-200 bg-rose-50/50">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <X className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-rose-700">
                Pedido cancelado
              </p>
              <p className="mt-1 break-words text-[13px] leading-relaxed text-rose-900">
                {order.cancellation_reason || (
                  <span className="italic text-rose-600/70">Motivo não informado</span>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section>
        <h4 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
          Linha do tempo
        </h4>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <OrderTrackingTimeline
            currentStatus={order.status}
            orderId={order.id}
            showTitle={false}
            isVendor
          />
        </div>
      </section>
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────
interface OrderDetailPanelProps {
  orderId: number | null
  onStatusUpdate?: () => void
}

export function OrderDetailPanel({ orderId }: OrderDetailPanelProps) {
  const { data: order, isLoading, error } = useOrderDetail(orderId ?? 0)
  const [isPrintOpen, setIsPrintOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('resumo')
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptCancellationRequest()
  const { mutate: denyRequest, isPending: isDenying } = useDenyCancellationRequest()

  if (isLoading) {
    return (
      <div className="flex h-full min-w-0 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6">
        <div className="flex w-full animate-pulse flex-col gap-3">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex h-full min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-6 text-center">
        <p className="text-sm font-bold text-rose-700">Erro ao carregar o pedido</p>
        <p className="mt-1 text-xs text-rose-500">Tente selecionar novamente</p>
      </div>
    )
  }

  const ActiveTabComponent = {
    resumo: <ResumoTab order={order} />,
    itens: <ItensTab order={order} />,
    cliente: <ClienteTab order={order} onPrint={() => setIsPrintOpen(true)} />,
    historico: <HistoricoTab order={order} />,
  }[activeTab]

  const isBlingSynced = order.bling_sync?.status === 'synced'

  return (
    <div className="flex h-full min-w-0 flex-col gap-4 overflow-hidden">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-3">
        {/* Linha 1: status + ID + sync */}
        <div className="flex items-center justify-between gap-2">
          <StatusChip status={order.status} size="md" />
          <div className="flex items-center gap-1.5">
            {isBlingSynced && (
              <span
                title="Sincronizado com Bling"
                className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-emerald-700 ring-1 ring-inset ring-emerald-200"
              >
                <CheckCircle className="h-2.5 w-2.5" strokeWidth={2.5} />
                Bling
              </span>
            )}
          </div>
        </div>

        {/* Linha 2: ID em mono + botão de copiar */}
        <div className="flex items-center gap-1">
          <span className="font-mono text-[12px] font-semibold text-gray-500">
            #{order.order_code}
          </span>
          <CopyButton value={order.order_code} label="código do pedido" />
          <span className="text-gray-300">·</span>
          <span className="text-[12px] text-gray-500">
            {formatDate(order.created_at)} <span className="text-gray-400">({relativeTimeOrder(order.created_at)})</span>
          </span>
        </div>

        {/* Linha 3: nome do cliente em destaque */}
        <h2
          className="truncate text-[20px] font-extrabold leading-tight tracking-[-0.025em] text-gray-900"
          title={order.customer_name}
        >
          {order.customer_name}
        </h2>

        {/* Cancellation request — alerta destacado */}
        {order.cancellation_requested === 1 && (
          <div className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
            <div className="flex items-start gap-2.5 px-3.5 py-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-orange-900">
                  Cliente solicitou o cancelamento
                </p>
                {order.cancellation_request_reason && (
                  <p className="mt-1 break-words rounded-md bg-white/70 px-2 py-1.5 text-[12px] leading-relaxed text-orange-800">
                    “{order.cancellation_request_reason}”
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-orange-200 bg-orange-200/40">
              <button
                type="button"
                onClick={() => denyRequest(order.id)}
                disabled={isAccepting || isDenying}
                className="inline-flex items-center justify-center gap-1.5 bg-white px-3 py-2 text-[12.5px] font-semibold text-orange-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDenying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                {isDenying ? 'Recusando…' : 'Recusar'}
              </button>
              <button
                type="button"
                onClick={() => acceptRequest(order.id)}
                disabled={isAccepting || isDenying}
                className="inline-flex items-center justify-center gap-1.5 bg-rose-600 px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAccepting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                {isAccepting ? 'Aceitando…' : 'Aceitar e cancelar'}
              </button>
            </div>
          </div>
        )}

        {/* Tabs underlined (estilo Stripe/Linear) */}
        <nav role="tablist" aria-label="Seções do pedido" className="-mx-1 flex border-b border-gray-200">
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            const count = tab.count?.(order)
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold transition-colors',
                  active
                    ? 'text-nxp'
                    : 'text-gray-500 hover:text-gray-800',
                )}
              >
                {tab.label}
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      'inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums',
                      active ? 'bg-nxp text-white' : 'bg-gray-100 text-gray-500',
                    )}
                  >
                    {count}
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-sm bg-nxp"
                  />
                )}
              </button>
            )
          })}
        </nav>
      </header>

      {/* ─── Tab content (scrollable) ─────────────────────────────────────── */}
      <div className="-mx-1 flex-1 overflow-y-auto overflow-x-hidden px-1 pb-2">
        {ActiveTabComponent}
      </div>

      <OrderPrintModal
        order={order}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  )
}
