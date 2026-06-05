'use client'

import { IconWhatsApp } from '@/assets/icons/IconWhatsApp'

interface WhatsAppFlowBannerProps {
  storeName: string
}

export function WhatsAppFlowBanner({ storeName }: WhatsAppFlowBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-nxp/15 bg-nxp/[0.05] p-4 ck-rise">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wa/12 text-wa">
        <IconWhatsApp size={20} />
      </div>
      <div>
        <h3 className="text-[13.5px] font-bold text-nxi1">Como funciona o pagamento</h3>
        <p className="mt-0.5 max-w-[68ch] text-[12.5px] leading-relaxed text-nxi2">
          Ao finalizar, abrimos uma conversa no <b>WhatsApp da {storeName}</b> com o resumo do seu
          pedido. <b>Pagamento e entrega</b> são combinados diretamente com a loja — rápido e sem
          complicação.
        </p>
      </div>
    </div>
  )
}
