'use client'

import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { SellerAvatar } from './components/SellerAvatar'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

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
      <motion.div
        className={s.secHead}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h2 className={s.h2}>De planilha bagunçada a pedido organizado.</h2>
      </motion.div>
      <motion.div
        className={s.testRow}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {TESTIMONIALS.map((t) => (
          <motion.div key={t.name} className={s.testCol} variants={fadeUp}>
            <p className={s.testQuote}>{t.q}</p>
            <div className={s.testWho}>
              <SellerAvatar name={t.name} size={34} />
              <div>
                <div className={s.testName}>{t.name}</div>
                <div className={s.testRole}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)
