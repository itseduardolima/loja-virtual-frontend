'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { getStoreMonogram } from '@/lib/storefront'
import { cn } from '@/lib/utils'

interface SuccessHeroProps {
  orderCode: string
  customerName?: string | null
  storeName?: string | null
  onCopy: () => void
}

export function SuccessHero({ orderCode, customerName, storeName, onCopy }: SuccessHeroProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div>
      {/* hero no accent da loja — a confirmação é da loja, não da plataforma */}
      <div className="relative overflow-hidden bg-store pb-20 md:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-8 select-none font-integral text-[300px] leading-none text-white/[0.05]"
        >
          {getStoreMonogram(storeName)}
        </div>

        <div className="mx-auto max-w-[760px] px-4 pt-11 text-center md:pt-14">
          <div className="ck-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.12]">
            <svg
              viewBox="0 0 24 24"
              width={30}
              height={30}
              fill="none"
              stroke="#fff"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ck-check"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="mt-5 font-integral text-[24px] uppercase leading-tight tracking-tight text-white sm:text-[30px]">
            {customerName ? `Pedido confirmado, ${customerName}` : 'Pedido confirmado'}
          </h1>

          <p className="mx-auto mt-2.5 max-w-[46ch] text-[14px] leading-relaxed text-white/80">
            Abrimos uma conversa no WhatsApp da {storeName ?? 'loja'} para você combinar o
            pagamento e a entrega.
          </p>
        </div>
      </div>

      {/* ticket perfurado sobrepondo o hero */}
      {orderCode && (
        <div className="relative z-[2] mx-auto -mt-11 max-w-[560px] px-4">
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_2px_4px_rgba(27,32,48,0.05),0_20px_44px_-22px_rgba(27,32,48,0.25)]">
            {/* recortes laterais do ticket */}
            <span
              aria-hidden="true"
              className="absolute -left-[11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-nxbg shadow-[inset_0_1px_2px_rgba(27,32,48,0.06)]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-nxbg shadow-[inset_0_1px_2px_rgba(27,32,48,0.06)]"
            />

            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nxi3">
                Código do pedido
              </p>
              <p className="mt-0.5 truncate font-mono text-[21px] font-bold tracking-[0.08em] text-nxi1 sm:text-[24px]">
                {orderCode}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full px-4 text-[12.5px] font-extrabold text-white transition-[background,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 active:scale-[0.96]',
                copied ? 'bg-nxs' : 'bg-nxi1 hover:brightness-110',
              )}
            >
              {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
              {copied ? 'Copiado' : 'Copiar código'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
