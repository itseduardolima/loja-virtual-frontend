'use client'

import { Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { IconWhatsApp } from '@/assets/icons/IconWhatsApp'

interface CheckoutMobileBarProps {
  finalTotal: number
  isCheckoutLoading: boolean
}

/** Barra fixa de pagamento no mobile — total sempre visível + CTA.
 *  Renderizar DENTRO do <form> do checkout (o botão é type=submit). */
export function CheckoutMobileBar({ finalTotal, isCheckoutLoading }: CheckoutMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-nxborder bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[1080px] items-center gap-3">
        <div className="shrink-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-nxi3">
            Total
          </p>
          <p className="text-[18px] font-extrabold tracking-tight tabular-nums text-nxi1">
            {formatPrice(finalTotal)}
          </p>
        </div>
        <button
          type="submit"
          disabled={isCheckoutLoading}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-wa text-[14px] font-extrabold text-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-70"
        >
          {isCheckoutLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processando…
            </>
          ) : (
            <>
              <IconWhatsApp size={17} />
              Finalizar no WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  )
}
