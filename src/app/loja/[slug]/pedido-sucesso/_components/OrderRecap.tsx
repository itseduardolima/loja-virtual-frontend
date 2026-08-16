'use client'

import Image from 'next/image'
import { type OrderSnapshot } from '@/hooks/useCheckout'
import { buildImageUrl } from '@/lib/imageUtils'
import { formatPrice } from '@/lib/utils'

interface OrderRecapProps {
  snapshot: OrderSnapshot
}

function formatCreatedAt(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} às ${time}`
}

export function OrderRecap({ snapshot }: OrderRecapProps) {
  const createdAt = formatCreatedAt(snapshot.created_at)

  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white">
      {/* topo perfurado — espelha o ticket do código */}
      <div className="flex items-baseline justify-between border-b-2 border-dashed border-nxborder bg-nxsurf px-5 py-3">
        <h3 className="text-[13.5px] font-extrabold tracking-tight text-nxi1">Resumo do pedido</h3>
        <span className="font-mono text-[11px] text-nxi3">#{snapshot.order_code}</span>
      </div>

      <div className="p-5">
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
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-nxborder bg-nxsurf">
                  {item.image ? (
                    <Image
                      src={buildImageUrl(item.image)}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-nxbg" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[12.5px] font-bold text-nxi1">{item.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-nxi3">
                    {meta}
                  </p>
                </div>

                <span className="text-[12.5px] font-bold tabular-nums text-nxi1">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            )
          })}
        </div>

        {/* totais — tudo que o snapshot traz */}
        <div className="mt-4 space-y-2 border-t border-nxborder pt-3 text-[13px]">
          <div className="flex justify-between text-nxi2">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums text-nxi1">
              {formatPrice(snapshot.subtotal)}
            </span>
          </div>
          {snapshot.discount > 0 && (
            <div className="flex items-center justify-between text-nxi2">
              <span>
                Desconto
                {snapshot.coupon_code && (
                  <span className="ml-1.5 rounded-full bg-nxs/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.06em] text-nxs">
                    {snapshot.coupon_code}
                  </span>
                )}
              </span>
              <span className="font-semibold tabular-nums text-nxs">
                −{formatPrice(snapshot.discount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-nxi2">
            <span>Entrega</span>
            <span className="text-[12px] font-semibold text-nxi1">combinada no WhatsApp</span>
          </div>
          <div className="flex items-center justify-between border-t border-nxborder pt-2.5">
            <span className="text-[14px] font-bold text-nxi1">Total</span>
            <span className="text-[22px] font-extrabold tracking-tight tabular-nums text-nxi1">
              {formatPrice(snapshot.total)}
            </span>
          </div>
          {createdAt && (
            <p className="text-right text-[11.5px] text-nxi3">Pedido feito em {createdAt}</p>
          )}
        </div>
      </div>
    </div>
  )
}
