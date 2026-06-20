import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import s from '../landing.module.css'

const FACES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&fit=crop&crop=faces',
]

export const Hero = () => (
  <section className={s.hero}>
    <div className={s.wrap}>
      <div className={s.heroGrid}>
        <div data-rev>
          <h1 className={s.h1}>Chega de perder venda no WhatsApp.</h1>
          <p className={s.heroSub}>
            Sua loja com Pix, cartão e WhatsApp automático. Gerencie do celular, venda 24h.
          </p>
          <div className={s.heroCtas}>
            <Link
              href="#precos"
              style={{ color: 'var(--wht)' }}
              className={`${s.btn} ${s.btnPri} ${s.btnLg}`}
            >
              Criar minha loja
            </Link>
            <button className={`${s.btn} ${s.btnOutline}`} type="button">
              <Play size={17} color="#4F46E5" />
              Ver como funciona (2 min)
            </button>
          </div>
          <div className={s.heroProof}>
            <div className={s.stackFaces}>
              {FACES.map((src, i) => (
                <Image key={i} src={src} alt="" width={32} height={32} />
              ))}
            </div>
            Mais de 1.200 lojistas de moda já migraram do WhatsApp
          </div>
        </div>

        <div className={s.phoneStage} data-rev>
          <div className={`${s.phone} ${s.floatAnim}`}>
            <div className={s.phoneScreen}>
              <div className={s.psHead}>
                <div className={s.psHeadRow}>
                  <span className={s.psTitle}>Pedidos</span>
                  <span className={`${s.badge} ${s.bNovo}`}>3 novos</span>
                </div>
                <div className={s.psKpis}>
                  <div className={s.psKpi}>
                    <div className={s.psKpiLabel}>Hoje</div>
                    <div className={s.psKpiVal}>R$ 890</div>
                  </div>
                  <div className={s.psKpi}>
                    <div className={s.psKpiLabel}>Pedidos</div>
                    <div className={s.psKpiVal}>14</div>
                  </div>
                  <div className={s.psKpi}>
                    <div className={s.psKpiLabel}>A enviar</div>
                    <div className={s.psKpiVal}>5</div>
                  </div>
                </div>
              </div>
              <div className={s.psBody}>
                <div className={s.psCard}>
                  <div className={s.psCardRow}>
                    <span className={s.psCode}>#A1B2C3</span>
                    <span className={`${s.badge} ${s.bNovo} ${s.badgeMarginLeft}`}>Novo</span>
                  </div>
                  <div className={s.psCardName}>Vestido midi linho · Tam M</div>
                  <div className={s.psCardMeta}>Marina · há 4 min · R$ 189,90</div>
                </div>
                <div className={s.psCard}>
                  <div className={s.psCardRow}>
                    <span className={s.psCode}>#F4G5H6</span>
                    <span className={`${s.badge} ${s.bPrep} ${s.badgeMarginLeft}`}>
                      Em preparação
                    </span>
                  </div>
                  <div className={s.psCardName}>Tênis branco · Tam 39</div>
                  <div className={s.psCardMeta}>João · há 1 h · R$ 229,00</div>
                </div>
                <div className={s.psCard}>
                  <div className={s.psCardRow}>
                    <span className={s.psCode}>#K7L8M9</span>
                    <span className={`${s.badge} ${s.bEnv} ${s.badgeMarginLeft}`}>Enviado</span>
                  </div>
                  <div className={s.psCardName}>Camisa social slim · G</div>
                  <div className={s.psCardMeta}>Ana B. · há 3 h · R$ 139,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
