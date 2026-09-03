'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { Play, DollarSign, ShoppingBag, Receipt, TrendingUp } from 'lucide-react'
import s from '../landing.module.css'

const ThreadField = dynamic(() => import('./three/ThreadField'), { ssr: false })

/** Ativa o campo de fios 3D só em telas grandes e quando o usuário não pediu menos movimento. */
function useThreadFieldEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wideMq = window.matchMedia('(min-width: 1024px)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setEnabled(wideMq.matches && !motionMq.matches)
    update()

    wideMq.addEventListener('change', update)
    motionMq.addEventListener('change', update)
    return () => {
      wideMq.removeEventListener('change', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  return enabled
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const heroVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
}

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 22, clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO },
  },
}

export const Hero = () => {
  const threadFieldEnabled = useThreadFieldEnabled()

  return (
    <section className={s.hero}>
      <div className={s.threadFieldWrap}>
        {threadFieldEnabled ? <ThreadField /> : <div className={s.threadFieldFallback} />}
      </div>

      <div className={s.wrap}>
        <motion.div
          className={s.heroGrid}
          variants={heroVariants}
          initial="hidden"
          animate="show"
        >
          <div>
            <motion.h1 className={s.h1} variants={headlineVariants}>
              Chega de perder venda no WhatsApp.
            </motion.h1>
            <motion.p className={s.heroSub} variants={fadeUpVariants}>
              Catálogo, carrinho e pedido organizado num link só. O pagamento continua
              combinado no WhatsApp, do jeito que seu cliente já confia.
            </motion.p>
            <motion.div className={s.heroCtas} variants={fadeUpVariants}>
              <Link
                href="#precos"
                style={{ color: 'var(--wht)' }}
                className={`${s.btn} ${s.btnPri} ${s.btnLg}`}
              >
                Criar minha loja
              </Link>
              <button className={`${s.btn} ${s.btnOutline}`} type="button">
                <Play size={17} color="#2A2D7C" />
                Ver como funciona
              </button>
            </motion.div>
          </div>

          <motion.div className={s.dashStage} variants={cardVariants}>
            <div className={`${s.dashCard} ${s.floatAnim}`}>
              <div className={s.dashGreetRow}>
                <div>
                  <div className={s.dashGreet}>Bom dia, Marina</div>
                  <div className={s.dashSub}>Gerencie sua loja e acompanhe suas vendas.</div>
                </div>
                <span className={s.dashToday}>HOJE</span>
              </div>

              <div className={s.kpiGrid}>
                <div className={s.kpi}>
                  <div className={s.kpiTop}>
                    <span className={s.kpiLabel}>Receita hoje</span>
                    <span className={`${s.kpiIcon} ${s.kpiIconPrimary}`}>
                      <DollarSign size={13} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={s.kpiVal}>R$ 890</div>
                  <div className={`${s.kpiDelta} ${s.kpiDeltaUp}`}>↑ 12% vs ontem</div>
                </div>

                <div className={s.kpi}>
                  <div className={s.kpiTop}>
                    <span className={s.kpiLabel}>Pedidos hoje</span>
                    <span className={`${s.kpiIcon} ${s.kpiIconAccent}`}>
                      <ShoppingBag size={13} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={s.kpiVal}>14</div>
                  <div className={`${s.kpiDelta} ${s.kpiDeltaUp}`}>↑ 3 vs ontem</div>
                </div>

                <div className={s.kpi}>
                  <div className={s.kpiTop}>
                    <span className={s.kpiLabel}>Ticket médio</span>
                    <span className={`${s.kpiIcon} ${s.kpiIconWarning}`}>
                      <Receipt size={13} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={s.kpiVal}>R$ 63,50</div>
                  <div className={`${s.kpiDelta} ${s.kpiDeltaFlat}`}>sem variação</div>
                </div>

                <div className={s.kpi}>
                  <div className={s.kpiTop}>
                    <span className={s.kpiLabel}>Conversão do carrinho</span>
                    <span className={`${s.kpiIcon} ${s.kpiIconSuccess}`}>
                      <TrendingUp size={13} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={s.kpiVal}>24,3%</div>
                  <div className={`${s.kpiDelta} ${s.kpiDeltaUp}`}>↑ 2,1pp</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
