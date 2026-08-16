'use client'

import Image from 'next/image'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { buildImageUrl, formatPrice, getCartItemImage } from '@/lib/utils'
import { IconWhatsApp } from '@/assets/icons/IconWhatsApp'
import type { CouponResult } from '../useCheckoutPage'

interface CartItem {
  id: number | string
  quantity: number
  subtotal: number
  color?: string | null
  size?: string | null
  product: {
    name: string
    price: string
    images: unknown
  }
}

interface OrderSummaryProps {
  cartItems: CartItem[]
  totalPrice: number
  finalTotal: number
  couponResult: CouponResult | null
  isCheckoutLoading: boolean
  storeName?: string | null
}

export function OrderSummary({
  cartItems,
  totalPrice,
  finalTotal,
  couponResult,
  isCheckoutLoading,
  storeName,
}: OrderSummaryProps) {
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const discount = Math.max(totalPrice - finalTotal, 0)

  return (
    <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_2px_4px_rgba(27,32,48,0.04),0_16px_40px_-24px_rgba(27,32,48,0.18)]">
      <h2 className="mb-4 text-[15px] font-extrabold tracking-tight text-nxi1">Resumo do pedido</h2>

      {/* Lista de itens */}
      <div className="mb-4 max-h-[260px] space-y-3 overflow-y-auto">
        {cartItems.map((item) => {
          const imgRaw = getCartItemImage(item)
          const imgUrl = imgRaw ? buildImageUrl(imgRaw) : null

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-nxborder bg-nxsurf">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-nxbg">
                    <ShoppingBag size={16} className="text-nxi3" />
                  </div>
                )}
                
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[12.5px] font-bold text-nxi1">
                  {item.product.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-nxi3">
                  {[item.color, item.size && `Tam ${item.size}`].filter(Boolean).join(' · ')}
                </p>
              </div>

              <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-nxi1">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totais */}
      <div className="space-y-2 border-t border-nxborder pt-3 text-[13px]">
        <div className="flex justify-between text-nxi2">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
          </span>
          <span className="font-semibold tabular-nums text-nxi1">{formatPrice(totalPrice)}</span>
        </div>

        {couponResult && (
          <div className="flex justify-between">
            <span className="text-nxi2">
              Desconto{' '}
              <span className="text-[11.5px] font-extrabold text-store-ink">
                · você economiza {formatPrice(discount)}
              </span>
            </span>
            <span className="font-semibold tabular-nums text-nxs">−{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-nxi2">
          <span>Entrega</span>
          <span className="text-[12px] font-semibold text-nxi1">combinada no WhatsApp</span>
        </div>

        <div className="flex items-center justify-between border-t border-nxborder pt-2.5">
          <span className="text-[14px] font-bold text-nxi1">Total</span>
          <span className="text-[24px] font-extrabold tracking-tight tabular-nums text-nxi1">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* CTA — no mobile vive na barra fixa */}
      <button
        type="submit"
        disabled={isCheckoutLoading}
        className="mt-4 hidden h-[52px] w-full items-center justify-center gap-2 rounded-full bg-wa text-[15px] font-extrabold text-white transition-[transform,filter] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-70 lg:flex"
      >
        {isCheckoutLoading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Processando…
          </>
        ) : (
          <>
            <IconWhatsApp size={18} />
            Finalizar no WhatsApp
          </>
        )}
      </button>

      <p className="mt-3 hidden text-center text-[11.5px] text-nxi3 lg:block">
        Abre uma conversa com a {storeName ?? 'loja'} levando seu pedido
      </p>
    </div>
  )
}
