import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import s from '../landing.module.css'
import { HERO_FACES } from './data'

const ORDERS = [
  { code: '#1042', name: 'Kit festa junina', meta: 'Pix · R$ 189', badge: s.heroOrderBadgeNew, label: 'Novo' },
  { code: '#1041', name: 'Bolo de morango', meta: 'Cartão · R$ 95', badge: s.heroOrderBadgeProg, label: 'Em preparo' },
  { code: '#1040', name: 'Brigadeiros (40un)', meta: 'Pix · R$ 120', badge: s.heroOrderBadgeSent, label: 'Enviado' },
]

export function Hero() {
  return (
    <section id="top" className={s.section}>
      <div className={s.bgHero} />
      <div className={s.container}>
        <div className={s.heroWrap}>
          <div className={s.heroCopy} data-rev>
            <span className={s.eyebrow}>
              <span className={s.dot} />
              Plataforma para quem vende pelo celular
            </span>
            <h1 className={`${s.hDisplay} ${s.heroHeadline}`}>
              Chega de perder venda{' '}
              <span className={s.heroGrad}>no WhatsApp.</span>
            </h1>
            <p className={`${s.lede} ${s.heroLede}`}>
              Crie sua loja virtual em minutos. Receba pedidos organizados, pagamentos automáticos e controle tudo pelo celular.
            </p>

            <div className={s.heroCtas}>
              <Link href="/assinatura" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
                Criar minha loja <ArrowRight size={18} />
              </Link>
              <a href="#como" className={`${s.btn} ${s.btnGhost} ${s.btnLg}`}>
                Ver como funciona
              </a>
            </div>

            <div className={s.heroFaces}>
              {HERO_FACES.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="Vendedor Nexo"
                  width={36}
                  height={36}
                  className={s.heroFaceImg}
                />
              ))}
              <span className={s.heroFacesLabel}>
                <strong>+500 vendedores</strong><br />já vendem pela Nexo
              </span>
            </div>
          </div>

          <div className={`${s.heroPhoneWrap} ${s.floatAnim}`} data-rev>
            <div className={s.heroPhone}>
              <div className={s.heroPhoneScreen}>
                <div className={s.heroPhoneNotch} />
                <div className={s.heroPhoneInner}>
                  <div className={s.heroPhoneHeader}>Meus pedidos</div>
                  <div className={s.heroKpis}>
                    <div className={s.heroKpi}>
                      <div className={s.heroKpiVal}>R$890</div>
                      <div className={s.heroKpiLabel}>Hoje</div>
                    </div>
                    <div className={s.heroKpi}>
                      <div className={s.heroKpiVal}>14</div>
                      <div className={s.heroKpiLabel}>Pedidos</div>
                    </div>
                    <div className={s.heroKpi}>
                      <div className={s.heroKpiVal}>5</div>
                      <div className={s.heroKpiLabel}>A enviar</div>
                    </div>
                  </div>
                  <div className={s.heroOrderList}>
                    {ORDERS.map((o) => (
                      <div key={o.code} className={s.heroOrderCard}>
                        <div>
                          <div className={s.heroOrderCode}>{o.code}</div>
                          <div className={s.heroOrderName}>{o.name}</div>
                          <div className={s.heroOrderMeta}>{o.meta}</div>
                        </div>
                        <span className={`${s.heroOrderBadge} ${o.badge}`}>{o.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
