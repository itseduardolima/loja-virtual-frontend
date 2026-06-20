import Image from 'next/image'
import s from '../landing.module.css'

const TESTIMONIALS = [
  { q: '"Migrei da Nuvemshop e pago menos da metade. E o suporte responde de verdade."', name: 'Carla M.', role: 'Moda feminina · Belo Horizonte', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80&fit=crop&crop=faces' },
  { q: '"Minhas clientes agora escolhem o tamanho e pagam sozinhas. Eu só separo e envio."', name: 'Juliana R.', role: 'Brechó & moda · Fortaleza', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&fit=crop&crop=faces' },
  { q: '"Subi 120 pares de tênis em 8 minutos, juro. Minha irmã que não manja nada conseguiu."', name: 'Diego F.', role: 'Calçados · Porto Alegre', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&fit=crop&crop=faces' },
]

export const Testimonials = () => (
  <section className={s.sec}>
    <div className={s.wrap}>
      <div className={s.secHead} data-rev>
        <div className={s.eyebrow}>Quem já usa</div>
        <h2 className={s.h2}>Lojistas de moda que largaram a planilha</h2>
      </div>
      <div className={s.tcards}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className={s.tcard} data-rev>
            <div className={s.tstars}>★★★★★</div>
            <p className={s.tcardQ}>{t.q}</p>
            <div className={s.tcardWho}>
              <Image src={t.img} alt={t.name} width={46} height={46} style={{borderRadius:'50%',objectFit:'cover'}} />
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
