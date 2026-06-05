'use client'

import { Copy } from 'lucide-react'

interface SuccessHeroProps {
  orderCode: string
  customerName?: string | null
  onCopy: () => void
}

export function SuccessHero({ orderCode, customerName, onCopy }: SuccessHeroProps) {
  return (
    <div className="relative overflow-hidden bg-nxp">
      {/* decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-16 select-none font-integral text-[240px] leading-none text-white/[0.06]"
      >
        ✓
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-12 text-center md:py-16">
        {/* círculo com check animado */}
        <div className="ck-pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            viewBox="0 0 24 24"
            width={38}
            height={38}
            fill="none"
            stroke="hsl(var(--nxs))"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ck-check"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-integral text-[26px] leading-tight tracking-tight text-white sm:text-[32px]">
          Pedido confirmado
        </h1>

        <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-white/75">
          {customerName
            ? `Obrigado, ${customerName} — seu pedido foi registrado. Agora é só combinar o resto com a loja no WhatsApp.`
            : 'Obrigado — seu pedido foi registrado. Agora é só combinar o resto com a loja no WhatsApp.'}
        </p>

        {/* ticket do código */}
        {orderCode && (
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur ring-1 ring-white/15">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              Código do pedido
            </span>
            <span className="font-mono text-[16px] font-bold tracking-wider text-white">
              #{orderCode}
            </span>
            <button
              type="button"
              onClick={onCopy}
              aria-label="Copiar código do pedido"
              className="text-white/60 transition-colors hover:text-white"
            >
              <Copy size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
