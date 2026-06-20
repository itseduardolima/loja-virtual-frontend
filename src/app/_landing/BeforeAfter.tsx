import { X, Check, MessageCircle } from 'lucide-react'
import s from '../landing.module.css'
import { WhatsappIcon } from '@/assets/icons'

export const BeforeAfter = () => (
  <section className={`${s.sec} ${s.bgWht}`}>
    <div className={s.wrap}>
      <div className={s.secHead} data-rev>
        <div className={s.eyebrow}>Antes e depois</div>
        <h2 className={s.h2}>Você reconhece a primeira coluna?</h2>
        <p className={s.lead}>A maioria das lojas de roupa começa anotando tudo na mão. O Nexo automatiza o que rouba seu tempo.</p>
      </div>
      <div className={s.baGrid}>
        <div className={`${s.baCard} ${s.baAntes}`} data-rev>
          <div className={`${s.baHead} ${s.baHeadAntes}`}>
            <WhatsappIcon />Antes · só WhatsApp
          </div>
          <ul className={s.baList}>
            <li><X size={19} color="#94A3B8" />Tira pedido por mensagem de texto, uma a uma</li>
            <li><X size={19} color="#94A3B8" />Confirma cada Pix na mão, olhando o extrato</li>
            <li><X size={19} color="#94A3B8" />Anota numeração e pedido no bloco de notas</li>
            <li><X size={19} color="#94A3B8" />Perde a venda porque a peça já tinha esgotado</li>
          </ul>
        </div>
        <div className={`${s.baCard} ${s.baDepois}`} data-rev>
          <div className={`${s.baHead} ${s.baHeadDepois}`}>
            <span className={s.logoMark} style={{width:'24px',height:'24px',fontSize:'14px',borderRadius:'7px'}}>N</span>
            Depois · com o Nexo
          </div>
          <ul className={s.baList}>
            <li><Check size={19} color="#4F46E5" />Cliente escolhe, paga e recebe a confirmação sozinho</li>
            <li><Check size={19} color="#4F46E5" />Pix confirmado entra no painel automático</li>
            <li><Check size={19} color="#4F46E5" />Status do pedido atualizado com notificação no WhatsApp</li>
            <li><Check size={19} color="#4F46E5" />Nunca mais pedido sem resposta</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
)
