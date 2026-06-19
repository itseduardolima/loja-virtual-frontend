import { Smartphone, Users, TrendingUp } from 'lucide-react'
import s from '../landing.module.css'

const CARDS = [
  {
    icon: <Smartphone size={22} />,
    tagClass: s.posCardTagIndigo,
    iconClass: s.posCardIconIndigo,
    tag: 'Mobile-first',
    title: 'Você vende pelo celular',
    desc: 'Não importa se você não tem computador. O Nexo é feito pra você gerir tudo pelo smartphone — pedidos, produtos e pagamentos na palma da mão.',
  },
  {
    icon: <Users size={22} />,
    tagClass: s.posCardTagAmber,
    iconClass: s.posCardIconAmber,
    tag: 'Sem técnico',
    title: 'Simples como deve ser',
    desc: 'Sem contratar desenvolvedor. Sem depender de ninguém pra atualizar produto ou trocar preço. Você mesmo cuida da sua loja em minutos.',
  },
  {
    icon: <TrendingUp size={22} />,
    tagClass: s.posCardTagGreen,
    iconClass: s.posCardIconGreen,
    tag: 'Crescimento',
    title: 'Seu negócio em escala',
    desc: 'Do primeiro produto à centena de pedidos por dia. O Nexo cresce com você — sem migrar de plataforma, sem reinventar o que já funciona.',
  },
]

export function Posicionamento() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.posHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Pra quem é o Nexo</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Feito pra quem vende de verdade
          </h2>
          <p className={`${s.lede} ${s.sectionSubtitle}`}>
            Sem jargão técnico, sem mensalidade absurda, sem precisar de ninguém pra te ajudar.
          </p>
        </div>

        <div className={s.posCards}>
          {CARDS.map((card, i) => (
            <div key={i} className={s.posCard} data-rev>
              <span className={`${s.posCardTag} ${card.tagClass}`}>{card.tag}</span>
              <div className={`${s.posCardIcon} ${card.iconClass}`}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
