import s from '../landing.module.css'
import { SellerAvatar } from './components/SellerAvatar'

const TESTIMONIALS = [
  { q: '"Migrei da Nuvemshop e pago menos da metade. E o suporte responde de verdade."', name: 'Carla M.', role: 'Moda feminina · Belo Horizonte' },
  { q: '"Minhas clientes agora escolhem o tamanho e pagam sozinhas. Eu só separo e envio."', name: 'Juliana R.', role: 'Brechó & moda · Fortaleza' },
  { q: '"Subi 120 pares de tênis em 8 minutos, juro. Minha irmã que não manja nada conseguiu."', name: 'Diego F.', role: 'Calçados · Porto Alegre' },
]

export const Testimonials = () => (
  <section className={s.sec}>
    <div className={s.wrap}>
      <div className={s.secHead}>
        <div className={s.eyebrow}>Quem já usa</div>
        <h2 className={s.h2}>Lojistas de moda que largaram a planilha</h2>
      </div>
      <div className={s.tcards}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className={s.tcard}>
            <div className={s.tstars}>★★★★★</div>
            <p className={s.tcardQ}>{t.q}</p>
            <div className={s.tcardWho}>
              <SellerAvatar name={t.name} size={46} />
              <div>
                <div className={s.tcardName}>{t.name}</div>
                <div className={s.tcardRole}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
