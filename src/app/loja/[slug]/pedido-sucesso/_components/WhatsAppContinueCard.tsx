'use client'

import { IconWhatsApp } from '@/assets/icons/IconWhatsApp'

interface WhatsAppContinueCardProps {
  storeName?: string | null
  whatsappHref: string
}

export function WhatsAppContinueCard({ storeName, whatsappHref }: WhatsAppContinueCardProps) {
  return (
    <div className="ck-rise rounded-2xl border border-wa/25 bg-white p-5 shadow-[0_8px_30px_rgba(3,7,18,0.06)] sm:p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        {/* ícone */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-wa/12 text-wa">
          <IconWhatsApp size={28} />
        </div>

        {/* texto */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-[16px] font-extrabold tracking-tight text-nxi1">
            Continue no WhatsApp
          </h2>
          <p className="mt-1 max-w-[52ch] text-[13px] leading-relaxed text-nxi2">
            Abrimos uma conversa com a {storeName ?? 'loja'} com o resumo do pedido. Combine{' '}
            <b>pagamento</b> e <b>entrega</b> por lá para concluir.
          </p>
        </div>

        {/* CTA */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-wa px-6 text-[14px] font-bold text-white transition-transform active:scale-95 sm:w-auto"
        >
          <IconWhatsApp size={18} />
          Abrir conversa
        </a>
      </div>
    </div>
  )
}
