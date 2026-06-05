'use client'

import Image from 'next/image'
import { type OrderSnapshot } from '@/hooks/useCheckout'
import { buildImageUrl } from '@/lib/imageUtils'
import { formatPrice } from '@/lib/utils'

interface OrderRecapProps {
  snapshot: OrderSnapshot
}

export function OrderRecap({ snapshot }: OrderRecapProps) {
  return (
    <div className="rounded-2xl border border-nxborder bg-white p-5">
      {/* cabeçalho */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-extrabold tracking-tight text-nxi1">Resumo do pedido</h3>
        <span className="font-mono text-[11px] text-nxi3">#{snapshot.order_code}</span>
      </div>

      {/* itens */}
      <div className="space-y-3">
        {snapshot.items.map((item, idx) => {
          const meta = [
            item.color ?? null,
            item.size ? `Tam ${item.size}` : null,
            `Qtd ${item.quantity}`,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <div key={idx} className="flex items-center gap-3">
              {/* thumb */}
              <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-nxborder">
                {item.image ? (
                  <Image
                    src={buildImageUrl(item.image)}
                    alt={item.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-nxbg" />
                )}
              </div>

              {/* info */}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[12.5px] font-bold text-nxi1">{item.name}</p>
                <p className="text-[11px] text-nxi3">{meta}</p>
              </div>

              {/* subtotal */}
              <span className="text-[12.5px] font-bold text-nxi1">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          )
        })}
      </div>

      {/* totais */}
      <div className="mt-3 space-y-1.5 border-t border-nxborder pt-3 text-[13px]">
        {snapshot.discount > 0 && (
          <div className="flex justify-between text-nxs">
            <span>Desconto</span>
            <span className="font-semibold">−{formatPrice(snapshot.discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-nxi1">Total</span>
          <span className="text-[18px] font-extrabold text-nxi1">
            {formatPrice(snapshot.total)}
          </span>
        </div>
        <p className="text-[11.5px] text-nxi3">
          Entrega e forma de pagamento combinadas no WhatsApp.
        </p>
      </div>
    </div>
  )
}
