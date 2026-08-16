'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  Mail,
  MapPin,
  Clock,
  QrCode,
  CreditCard,
  FileText,
  Banknote,
  ArrowLeftRight,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import { StoreInfo } from '@/types/store'
import { buildImageUrl } from '@/lib/utils'
import { paymentMethodLabel } from '@/lib/storefront'

function extractSocialUsername(value: string): string {
  return value
    .replace(/^https?:\/\/(www\.)?(instagram|facebook)\.com\//, '')
    .replace(/^@/, '')
    .replace(/\/$/, '')
    .split('?')[0]
    .split('/')[0]
}

function getPaymentIcon(method: string) {
  const lower = method.toLowerCase()
  if (lower.includes('pix')) return <QrCode className="w-3.5 h-3.5" />
  if (lower.includes('crédito') || lower.includes('credito') || lower.includes('credit'))
    return <CreditCard className="w-3.5 h-3.5" />
  if (lower.includes('débito') || lower.includes('debito') || lower.includes('debit'))
    return <CreditCard className="w-3.5 h-3.5" />
  if (lower.includes('boleto')) return <FileText className="w-3.5 h-3.5" />
  if (lower.includes('cash') || lower.includes('dinheiro')) return <Banknote className="w-3.5 h-3.5" />
  if (
    lower.includes('transfer') ||
    lower.includes('transferência') ||
    lower.includes('transferencia')
  )
    return <ArrowLeftRight className="w-3.5 h-3.5" />
  return <CreditCard className="w-3.5 h-3.5" />
}

function FooterWa({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.27-.1-.47-.15-.66.15-.2.3-.76.93-.93 1.12-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.08 1.7-.7 1.95-1.36.24-.67.24-1.24.17-1.36-.07-.12-.27-.2-.56-.34z M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.25-1.24A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.62 0-3.13-.45-4.42-1.23l-.32-.19-2.62.62.56-2.55-.2-.33A8.13 8.13 0 0 1 3.8 12 8.2 8.2 0 0 1 12 3.8 8.2 8.2 0 0 1 20.2 12 8.2 8.2 0 0 1 12 20.2z" />
    </svg>
  )
}

interface TrustItem { icon: ReactNode; title: string; sub: string }

const BASE_TRUST: TrustItem[] = [
  {
    icon: <FooterWa size={18} />,
    title: 'Atendimento humano',
    sub: 'pelo WhatsApp',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Compra segura',
    sub: 'dados protegidos',
  },
]

const PAGE_TYPE_SLUGS: Record<string, string> = {
  returns: 'trocas',
  shipping: 'envio',
  faq: 'faq',
  about: 'sobre',
  privacy: 'politica',
}

interface StoreNewFooterProps {
  storeInfo: StoreInfo
  slug: string
}

export function StoreNewFooter({ storeInfo, slug }: StoreNewFooterProps) {
  const hasAddress = !!(
    storeInfo.address ||
    storeInfo.city ||
    storeInfo.state ||
    storeInfo.zipcode ||
    storeInfo.neighborhood ||
    storeInfo.number ||
    storeInfo.complement
  )

  const initials = storeInfo.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const helpLinks = (storeInfo.store_pages ?? []).map((p) => ({
    label: p.title,
    href: `/loja/${slug}/pagina/${PAGE_TYPE_SLUGS[p.page_type] ?? p.page_type}`,
  }))

  const freeMin = storeInfo.free_delivery_min
  const hasFreeDelivery = freeMin !== null && freeMin !== undefined && Number(freeMin) > 0
  const freeMinLabel = hasFreeDelivery
    ? `acima de R$${Number(freeMin).toFixed(0)}`
    : ''

  const trust: TrustItem[] = [
    ...(hasFreeDelivery
      ? [{ icon: <Truck size={18} />, title: 'Frete grátis', sub: freeMinLabel }]
      : []),
    ...BASE_TRUST,
  ]

  return (
    <footer className="relative overflow-hidden bg-coal text-white">
      {/* glow accent no topo */}
      <div
        aria-hidden="true"
        className="store-glow pointer-events-none absolute -top-32 left-1/2 h-64 w-[680px] -translate-x-1/2 rounded-full opacity-[0.16] blur-3xl"
      />
      <div aria-hidden="true" className="store-hairline absolute inset-x-0 top-0 h-px" />

  

      {/* main grid */}
      <div className="relative mx-auto max-w-store px-4 py-12 md:px-10 md:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12">

          {/* Col 1 — Identidade (md:4) */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2.5">
              {storeInfo.logo ? (
                <Image
                  src={buildImageUrl(storeInfo.logo)}
                  alt={storeInfo.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-store text-[15px] font-extrabold text-white">
                  {initials}
                </span>
              )}
              <span className="text-[17px] font-extrabold tracking-tight">{storeInfo.name}</span>
            </div>

            {storeInfo.description && (
              <p className="mt-3.5 max-w-[260px] break-words text-[13px] leading-relaxed text-white/50">
                {storeInfo.description}
              </p>
            )}

            {storeInfo.whatsapp && (
              <a
                href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-bold text-[#0a2a16] transition-[filter] hover:brightness-105 active:scale-95"
              >
                <FooterWa size={17} /> Falar no WhatsApp
              </a>
            )}

            {/* ícones sociais */}
            <div className="mt-5 flex items-center gap-2">
              {storeInfo.instagram && (() => {
                const u = extractSocialUsername(storeInfo.instagram!)
                return (
                  <a
                    href={`https://instagram.com/${u}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram @${u}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/70 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )
              })()}
              {storeInfo.facebook && (() => {
                const u = extractSocialUsername(storeInfo.facebook!)
                return (
                  <a
                    href={`https://facebook.com/${u}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Facebook @${u}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/70 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )
              })()}
            </div>
          </div>

          {/* Col 2 — Comprar (md:2) */}
          <div className="md:col-span-2">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
              Comprar
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/loja/${slug}/produtos`}
                  className="text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  Todos os produtos
                </Link>
              </li>
              {storeInfo.categories?.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/loja/${slug}/produtos?category=${c.id}`}
                    className="text-[13px] text-white/65 transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Ajuda (md:3) — só renderiza se houver páginas ativas */}
          {helpLinks.length > 0 && (
            <div className="md:col-span-3">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                Ajuda
              </p>
              <ul className="space-y-2.5">
                {helpLinks.map((h) => (
                  <li key={h.href}>
                    <Link
                      href={h.href}
                      className="text-[13px] text-white/65 transition-colors hover:text-white"
                    >
                      {h.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4 — Atendimento (md:3) */}
          <div className="col-span-2 md:col-span-3">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
              Atendimento
            </p>
            <div className="space-y-3">
              {storeInfo.whatsapp && (
                <a
                  href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <FooterWa size={15} className="shrink-0 text-[#25D366]" />
                  {storeInfo.whatsapp}
                </a>
              )}
              {storeInfo.email && (
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="flex items-center gap-2.5 text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <Mail size={15} className="shrink-0 text-white/35" />
                  {storeInfo.email}
                </a>
              )}
              {hasAddress && (
                <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/65">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-white/35" />
                  <span>
                    {storeInfo.address && storeInfo.number
                      ? `${storeInfo.address}, ${storeInfo.number}`
                      : storeInfo.address}
                    {(storeInfo.city || storeInfo.state) && (
                      <> · {[storeInfo.city, storeInfo.state].filter(Boolean).join('–')}</>
                    )}
                  </span>
                </div>
              )}
              {storeInfo.business_hours && Object.keys(storeInfo.business_hours).length > 0 && (
                <div className="flex items-start gap-2.5 text-[13px] text-white/65">
                  <Clock size={15} className="mt-0.5 shrink-0 text-white/35" />
                  <div className="space-y-0.5">
                    {Object.entries(storeInfo.business_hours).map(([day, hours]) => (
                      <div key={day} className="flex gap-2">
                        <span className="text-white/40">{day}</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-store flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-10">
          {/* esquerda: pagamentos */}
          <div className="flex flex-wrap items-center gap-2.5">
            {storeInfo.payment_methods && storeInfo.payment_methods.length > 0 ? (
              <>
                <span className="text-[11px] font-semibold text-white/35">
                  Pagamento combinado no WhatsApp
                </span>
                <span className="h-3 w-px bg-white/15" />
                {storeInfo.payment_methods.map((m) => (
                  <span
                    key={m}
                    title={m}
                    className="flex h-7 items-center gap-1.5 rounded-md bg-white/[0.06] px-2 text-[11px] font-medium text-white/55 ring-1 ring-inset ring-white/10"
                  >
                    {getPaymentIcon(m)}
                    <span className="hidden sm:inline">{paymentMethodLabel(m)}</span>
                  </span>
                ))}
              </>
            ) : null}
          </div>

          {/* direita: copyright + badge */}
          <div className="flex items-center gap-4">
            <p className="text-[12px] text-white/35">
              © {new Date().getFullYear()} {storeInfo.name}
            </p>
            <a
              href={appUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/45 ring-1 ring-inset ring-white/10 transition-colors hover:text-white/70"
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-[hsl(var(--nxp))] text-[8px] font-bold text-white">
                N
              </span>
              Loja por Nexo
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
