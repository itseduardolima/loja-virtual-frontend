import Link from 'next/link'
import s from '../landing.module.css'

export const FinalCTA = () => (
  <section className={s.wrap}>
    <div className={s.final}>
      <h2>Sua loja no ar hoje. Do celular mesmo.</h2>
      <p>
        Em 10 minutos você monta sua loja e já começa a vender, do celular mesmo. Pergunte sobre
        período de teste no chat.
      </p>
      <Link href="/assinatura" className={s.btnOnlight} style={{color: 'var(--t1)'}}>
        Criar minha loja agora
      </Link>
    </div>
  </section>
)
