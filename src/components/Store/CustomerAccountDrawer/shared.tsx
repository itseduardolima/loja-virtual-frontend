'use client'

import Image from 'next/image'
import { Shirt, Clock, CheckCircle, Truck, XCircle, type LucideIcon } from 'lucide-react'
import { CUSTOMER_ORDER_STATUS } from '@/types/customer'
import { cn, buildImageUrl } from '@/lib/utils'

/* ─── Tipos ────────────────────────────────────────────────────────────── */

export type DrawerTab = 'conta' | 'pedidos' | 'desejos' | 'enderecos'

/* ─── Helpers ──────────────────────────────────────────────────────────── */

export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
}

/** Primeira imagem de um item de pedido — prioriza a cor escolhida quando `images` é mapa por cor. */
export function getFirstOrderItemImage(item: {
  product: { images: string[] | Record<string, string[]> }
  color: string | null
}): string | null {
  const images = item.product.images
  if (images && typeof images === 'object' && !Array.isArray(images)) {
    const obj = images as Record<string, string[]>
    if (item.color && obj[item.color]?.length) return obj[item.color][0]
    const firstKey = Object.keys(obj)[0]
    if (firstKey && obj[firstKey]?.length) return obj[firstKey][0]
  }
  if (Array.isArray(images) && images.length > 0) return images[0]
  return null
}

/* ─── Thumb — imagem com fallback ──────────────────────────────────────── */

export function Thumb({
  src,
  alt,
  sizes = '56px',
}: {
  src: string | null
  alt: string
  sizes?: string
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-nxbg text-nxi3">
        <Shirt size={18} />
      </div>
    )
  }
  return (
    <div className="relative h-full w-full">
      <Image src={buildImageUrl(src)} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}

/* ─── StatusBadge — labels reais do CUSTOMER_ORDER_STATUS, tons do design ── */

const STATUS_TONES: Record<string, { classes: string; icon: LucideIcon }> = {
  /* tinta âmbar (#9a6a16) do design p/ contraste sobre nxw — exceção de hex documentada */
  yellow: { classes: 'bg-nxw/[0.18] text-[#9a6a16]', icon: Clock },
  blue: { classes: 'bg-nxp/10 text-nxp', icon: CheckCircle },
  purple: { classes: 'bg-nxp/10 text-nxp', icon: Truck },
  green: { classes: 'bg-nxs/[0.12] text-nxs', icon: CheckCircle },
  red: { classes: 'bg-nxd/10 text-nxd', icon: XCircle },
}

export function getOrderStatusInfo(status: number) {
  return (
    CUSTOMER_ORDER_STATUS[status as keyof typeof CUSTOMER_ORDER_STATUS] || CUSTOMER_ORDER_STATUS[1]
  )
}

export function StatusBadge({ status }: { status: number }) {
  const info = getOrderStatusInfo(status)
  const tone = STATUS_TONES[info.color] ?? STATUS_TONES.yellow
  const Icon = tone.icon
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.03em]',
        tone.classes,
      )}
    >
      <Icon size={11} />
      {info.label}
    </span>
  )
}

/* ─── Empty state ──────────────────────────────────────────────────────── */

export function Empty({
  icon: Icon,
  title,
  desc,
  cta,
  onCta,
}: {
  icon: LucideIcon
  title: string
  desc: string
  cta?: string
  onCta?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-nxbg text-nxi3">
        <Icon size={28} />
      </div>
      <p className="mt-4 text-[15px] font-extrabold tracking-tight text-nxi1">{title}</p>
      <p className="mt-1.5 max-w-[28ch] text-[12.5px] leading-relaxed text-nxi3">{desc}</p>
      {cta && (
        <button
          onClick={onCta}
          className="mt-5 rounded-full bg-nxp px-5 py-2.5 text-[12.5px] font-bold text-white transition-transform active:scale-95"
        >
          {cta}
        </button>
      )}
    </div>
  )
}

/* ─── UField — campo underline da aba Conta ────────────────────────────── */

export function UField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  icon?: LucideIcon
  error?: string
}) {
  return (
    <div className="group">
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-nxi3">
        {label}
      </label>
      <div
        className={cn(
          'flex items-center gap-2 border-b-[1.5px] pb-1.5 transition-colors focus-within:border-nxp',
          error ? 'border-nxd' : 'border-nxborder',
        )}
      >
        {Icon && (
          <Icon size={15} className="text-nxi3 transition-colors group-focus-within:text-nxp" />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[14px] font-medium text-nxi1 outline-none placeholder:font-normal placeholder:text-nxi3"
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-nxd">{error}</p>}
    </div>
  )
}

/* ─── Spinner de carregamento das seções ───────────────────────────────── */

export function SectionSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-nxborder border-t-nxp" />
    </div>
  )
}
