'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  QrCode,
  CreditCard,
  FileText,
  Banknote,
  ArrowLeftRight,
} from 'lucide-react'
import { StoreInfo } from '@/types/store'
import { buildImageUrl } from '@/lib/utils'

function extractSocialUsername(value: string): string {
  return value
    .replace(/^https?:\/\/(www\.)?(instagram|facebook)\.com\//, '')
    .replace(/^@/, '')
    .replace(/\/$/, '')
    .split('?')[0]
    .split('/')[0]
}

interface StoreNewFooterProps {
  storeInfo: StoreInfo
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-4">
      {children}
    </p>
  )
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
  if (lower.includes('transfer') || lower.includes('transferência') || lower.includes('transferencia')) return <ArrowLeftRight className="w-3.5 h-3.5" />
  return <CreditCard className="w-3.5 h-3.5" />
}

function getPaymentLabel(method: string) {
  const lower = method.toLowerCase()
  if (lower.includes('pix')) return 'Pix'
  if (lower.includes('crédito') || lower.includes('credito') || lower.includes('credit'))
    return 'Cartão de Crédito'
  if (lower.includes('débito') || lower.includes('debito') || lower.includes('debit'))
    return 'Cartão de Débito'
  if (lower.includes('boleto')) return 'Boleto'
  if (lower.includes('cash') || lower.includes('dinheiro')) return 'Dinheiro'
  if (lower.includes('transfer') || lower.includes('transferência') || lower.includes('transferencia')) return 'Transferência Bancária'
  return method
}

export function StoreNewFooter({ storeInfo }: StoreNewFooterProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

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

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#030712] text-white pt-10 md:pt-14 pb-8 px-4 md:px-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 — Identity */}
        <div>
          <div className="flex items-center gap-3">
            {storeInfo.logo ? (
              <Image
                src={buildImageUrl(storeInfo.logo)}
                alt={storeInfo.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                {initials}
              </div>
            )}
            <span className="text-lg font-bold">{storeInfo.name}</span>
          </div>
          {storeInfo.description && (
            <p className="text-[13px] text-gray-400 leading-relaxed mt-3 max-w-[220px] break-words whitespace-normal">
              {storeInfo.description}
            </p>
          )}
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/50 text-[10px] px-2.5 py-1 rounded-full mt-3.5">
            Membro nexo
          </div>
          {storeInfo._count?.products != null && (
            <p className="text-[11px] text-gray-600 mt-2">
              {storeInfo._count.products} produtos cadastrados
            </p>
          )}

      
        </div>

        {/* Col 2 — Contact */}
        <div>
          <SectionLabel>Contato</SectionLabel>
          <div className="space-y-3">
            {storeInfo.phone && (
              <a
                href={`tel:${storeInfo.phone}`}
                className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {storeInfo.phone}
              </a>
            )}
            {storeInfo.whatsapp && (
              <a
                href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {storeInfo.whatsapp}
              </a>
            )}
            {storeInfo.email && (
              <a
                href={`mailto:${storeInfo.email}`}
                className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {storeInfo.email}
              </a>
            )}
            {storeInfo.instagram && (() => {
              const username = extractSocialUsername(storeInfo.instagram)
              return (
                <a
                  href={`https://instagram.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{username}
                </a>
              )
            })()}
            {storeInfo.facebook && (() => {
              const username = extractSocialUsername(storeInfo.facebook)
              return (
                <a
                  href={`https://facebook.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  @{username}
                </a>
              )
            })()}
            {storeInfo.website && (
              <a
                href={storeInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {storeInfo.website}
              </a>
            )}
          </div>
        </div>

        {/* Col 3 — Address & Hours */}
        <div>
          <SectionLabel>Onde Estamos</SectionLabel>
          {hasAddress && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <address className="text-[13px] text-gray-300 leading-relaxed not-italic">
                {storeInfo.address && storeInfo.number && (
                  <span className="block">
                    {storeInfo.address}, {storeInfo.number}
                  </span>
                )}
                {storeInfo.address && !storeInfo.number && (
                  <span className="block">{storeInfo.address}</span>
                )}
                {storeInfo.neighborhood && (
                  <span className="block">{storeInfo.neighborhood}</span>
                )}
                {(storeInfo.city || storeInfo.state) && (
                  <span className="block">
                    {[storeInfo.city, storeInfo.state].filter(Boolean).join(' – ')}
                    {storeInfo.zipcode && `, ${storeInfo.zipcode}`}
                  </span>
                )}
                {storeInfo.complement && (
                  <span className="block">{storeInfo.complement}</span>
                )}
              </address>
            </div>
          )}

          {storeInfo.business_hours && Object.keys(storeInfo.business_hours).length > 0 && (
            <div className="mt-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-3">
                Horário de Atendimento
              </p>
              <div className="space-y-1">
                {Object.entries(storeInfo.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-[13px]">
                    <span className="text-gray-400">{day}</span>
                    <span className="text-gray-300">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Col 4 — Payments */}
        {storeInfo.payment_methods && storeInfo.payment_methods.length > 0 && (
          <div>
            <SectionLabel>Formas de Pagamento</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {storeInfo.payment_methods.map((method) => (
                <div
                  key={method}
                  className="inline-flex items-center gap-1.5 bg-white/10 text-gray-300 text-[12px] font-medium px-2.5 py-1.5 rounded-lg"
                >
                  {getPaymentIcon(method)}
                  {getPaymentLabel(method)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[12px] text-gray-600">
          © 2025 {storeInfo.name}. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-600">
          Desenvolvido com
          <span className="w-[18px] h-[18px] rounded bg-white/10 inline-flex items-center justify-center text-[10px] font-bold text-white/40">
            N
          </span>
          <span className="text-white/30">nexo</span>
        </div>
      </div>
    </motion.footer>
  )
}
