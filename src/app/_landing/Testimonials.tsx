import s from '../landing.module.css'
import { SellerAvatar } from './components/SellerAvatar'

const TESTIMONIALS = [
  {
    q: '"Migrei da Nuvemshop e pago menos da metade. E o suporte responde de verdade."',
    name: 'Carla M.',
    role: 'Moda feminina · Belo Horizonte',
  },
  {
    q: '"Minhas clientes agora escolhem o tamanho e pagam sozinhas. Eu só separo e envio."',
    name: 'Juliana R.',
    role: 'Brechó & moda · Fortaleza',
  },
  {
    q: '"Subi 120 pares de tênis em 8 minutos, juro. Minha irmã que não manja nada conseguiu."',
    name: 'Diego F.',
    role: 'Calçados · Porto Alegre',
  },
]

export const Testimonials = () => (
  <section className={s.sec}>
    <div className={s.seam} />
    <div className={s.wrap}>
      <div className={s.secHead}>
        <h2 className={s.h2}>De planilha bagunçada a pedido organizado.</h2>
      </div>
      <div className={s.testRow}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className={s.testCol}>
            <p className={s.testQuote}>{t.q}</p>
            <div className={s.testWho}>
              <SellerAvatar name={t.name} size={34} />
              <div>
                <div className={s.testName}>{t.name}</div>
                <div className={s.testRole}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
