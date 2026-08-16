'use client'

interface WhatsAppFlowBannerProps {
  storeName: string
}

export function WhatsAppFlowBanner({ storeName }: WhatsAppFlowBannerProps) {
  return (
    <div className="ck-rise mb-6 flex items-start gap-3 rounded-2xl border border-nxborder bg-white p-4">
      
      <div>
        <h3 className="text-[13.5px] font-bold text-nxi1">
          O pagamento é combinado no WhatsApp da {storeName}
        </h3>
        <p className="mt-0.5 max-w-[68ch] text-[12.5px] leading-relaxed text-nxi2">
          Ao finalizar, abrimos uma conversa com a loja levando o seu pedido. Você combina{' '}
          <b>pagamento e entrega</b> direto com quem vende — sem cartão neste site.
        </p>
      </div>
    </div>
  )
}
