'use client'

import Image from 'next/image'
import { ShoppingBag, ShieldCheck, Loader2 } from 'lucide-react'
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
}

export function OrderSummary({
  cartItems,
  totalPrice,
  finalTotal,
  couponResult,
  isCheckoutLoading,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-nxborder bg-white p-5">
      <h2 className="mb-4 text-[15px] font-extrabold tracking-tight text-nxi1">Resumo do pedido</h2>

      {/* Lista de itens */}
      <div className="mb-4 max-h-[260px] space-y-3 overflow-y-auto">
        {cartItems.map((item) => {
          const imgRaw = getCartItemImage(item)
          const imgUrl = imgRaw ? buildImageUrl(imgRaw) : null

          return (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-nxborder">
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
                {/* Badge de quantidade */}
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-nxi1 px-1 text-[10px] font-bold text-white">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[12.5px] font-bold text-nxi1">
                  {item.product.name}
                </p>
                <p className="text-[11px] text-nxi3">
                  {[item.color, item.size && `Tam ${item.size}`].filter(Boolean).join(' · ')}
                </p>
              </div>

              <span className="shrink-0 text-[12.5px] font-bold text-nxi1">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totais */}
      <div className="space-y-2 border-t border-nxborder pt-3 text-[13px]">
        <div className="flex justify-between text-nxi2">
          <span>Subtotal</span>
          <span className="font-semibold text-nxi1">{formatPrice(totalPrice)}</span>
        </div>

        {couponResult && (
          <div className="flex justify-between text-nxs">
            <span>Desconto ({couponResult.coupon_code})</span>
            <span className="font-semibold">−{formatPrice(couponResult.discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-nxi2">
          <span>Entrega</span>
          <span className="text-[12px] font-semibold text-nxi3">combinada no WhatsApp</span>
        </div>

        <div className="flex items-center justify-between border-t border-nxborder pt-2.5">
          <span className="text-[14px] font-bold text-nxi1">Total</span>
          <span className="text-[20px] font-extrabold tracking-tight text-nxi1">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={isCheckoutLoading}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-nxp text-[14px] font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-70"
      >
        {isCheckoutLoading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Processando…
          </>
        ) : (
          <>
            <IconWhatsApp size={17} />
            Finalizar pedido
          </>
        )}
      </button>

      {/* Nota de segurança */}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-nxi3">
        <ShieldCheck size={13} className="text-nxs" />
        Seus dados são usados apenas para este pedido.
      </p>
    </div>
  )
}
