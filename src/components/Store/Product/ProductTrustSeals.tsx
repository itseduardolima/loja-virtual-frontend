'use client'

import { Truck, MapPin, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { freeShippingLabel, paymentMethodLabel } from '@/lib/storefront'
import type { StoreInfo } from '@/types/store'

interface StoreInfoProps {
  storeInfo?: StoreInfo | null
}

/** Métodos de pagamento reais da loja, sob o preço. Nada de parcelamento
 *  fabricado: o pagamento é combinado no WhatsApp. */
export function ProductPaymentLine({ storeInfo }: StoreInfoProps) {
  const methods = (storeInfo?.payment_methods ?? []).map(paymentMethodLabel)
  if (methods.length === 0) return null

  return (
    <p className="mt-2 text-[12.5px] text-nxi2">
      <span className="font-bold text-store-ink">{methods.join(' · ')}</span>
      {storeInfo?.whatsapp ? ' — combinado no WhatsApp' : null}
    </p>
  )
}

/** Selos de confiança derivados apenas de dados configurados pela loja;
 *  a faixa some quando há menos de dois. */
export function ProductTrustSeals({ storeInfo }: StoreInfoProps) {
  const seals: Array<{ icon: LucideIcon; label: string }> = []

  const shipping = freeShippingLabel(storeInfo)
  if (shipping) seals.push({ icon: Truck, label: shipping })
  if (storeInfo?.whatsapp) seals.push({ icon: ShieldCheck, label: 'Pagamento seguro no WhatsApp' })
  if (storeInfo?.city && storeInfo?.state) {
    seals.push({ icon: MapPin, label: `Enviado de ${storeInfo.city}/${storeInfo.state}` })
  }

  if (seals.length < 2) return null

  return (
    <div className="mt-5 flex divide-x divide-nxborder rounded-xl border border-nxborder">
      {seals.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-1 flex-col items-center gap-1.5 px-2 py-3 text-center text-[10.5px] font-bold leading-tight text-nxi2"
        >
          <Icon size={17} className="text-store-ink" />
          {label}
        </div>
      ))}
    </div>
  )
}
