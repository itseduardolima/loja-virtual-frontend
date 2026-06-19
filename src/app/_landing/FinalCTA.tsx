import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import s from '../landing.module.css'

export function FinalCTA() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.ctaBand} data-rev>
          <div>
            <div className={s.ctaBadge}>
              <span className={s.ctaBadgeDot} />
              Beta aberto
            </div>
            <h2 className={s.ctaTitle}>
              Pare de vender pelo WhatsApp.<br />
              <span className={s.ctaTitleGrad}>Comece de verdade.</span>
            </h2>
            <p className={s.ctaDesc}>
              Sem cartão de crédito. Em 10 minutos sua loja está no ar recebendo pedido.
            </p>
          </div>

          <div className={s.ctaActions}>
            <Link href="/assinatura" className={`${s.btn} ${s.btnWht} ${s.btnLg}`}>
              Criar minha loja agora <ArrowRight size={18} />
            </Link>
            <a href="#precos" className={s.ctaSecondary}>Ver planos →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
