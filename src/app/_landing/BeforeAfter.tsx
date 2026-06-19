import { X, Check, MessageCircle, Store } from 'lucide-react'
import s from '../landing.module.css'

const BAD = [
  'Pedidos perdidos no meio da conversa',
  'Sem controle de estoque — vende o que não tem',
  'Pagamento manual via Pix — sem comprovante automático',
  'Sem histórico de clientes nem recompra',
  'Imagem amadora — cliente desconfia',
]

const GOOD = [
  'Painel de pedidos organizado por status',
  'Estoque atualizado a cada venda',
  'Pix, cartão e boleto automáticos via Asaas',
  'Histórico completo — retargeting simples',
  'Loja profissional — confiança que converte',
]

export function BeforeAfter() {
  return (
    <section className={`${s.section} ${s.bgGradSoft} ${s.baSection}`}>
      <div className={s.container}>
        <div className={s.baHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Antes e depois</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Pare de improvisar. Comece a vender.
          </h2>
        </div>

        <div className={s.baGrid} data-rev>
          <div className={`${s.baCol} ${s.baColBad}`}>
            <div className={`${s.baColHead} ${s.baColHeadBad}`}>
              <MessageCircle size={16} /> WhatsApp
            </div>
            {BAD.map((text, i) => (
              <div key={i} className={s.baRow}>
                <X size={15} className={s.baRowIcon} color="#F43F5E" />
                {text}
              </div>
            ))}
          </div>

          <div className={s.baVs}>
            <div className={s.baVsPill}>VS</div>
          </div>

          <div className={s.baCol}>
            <div className={`${s.baColHead} ${s.baColHeadGood}`}>
              <Store size={16} /> Nexo
            </div>
            {GOOD.map((text, i) => (
              <div key={i} className={s.baRow}>
                <Check size={15} className={s.baRowIcon} color="#10B981" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
