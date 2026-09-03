'use client'

import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

const SPECS = [
  {
    label: 'Catálogo organizado',
    desc: 'Suas peças por categoria, com foto, preço e variações, fácil do cliente achar e escolher.',
  },
  {
    label: 'Gestão dos pedidos',
    desc: 'Tudo num painel: o que entrou, o que falta enviar e o que já foi entregue. Sem planilha.',
  },
  {
    label: 'Sua loja, sua marca',
    desc: 'Um link só seu pra mandar no WhatsApp e no Instagram. O cliente é seu, não da plataforma.',
  },
]

export const Posicionamento = () => (
  <section className={s.sec}>
    <div className={s.seam} />
    <div className={s.wrap}>
      <motion.div
        className={s.posLayout}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeUp}>
          <h2 className={s.h2}>A loja é sua. Os clientes também.</h2>
          <p className={s.lead}>
            O Nexo organiza seu catálogo e cuida da gestão dos pedidos: não é um marketplace
            gigante, é a sua loja, com os seus clientes do bairro, da cidade e das suas redes.
          </p>
        </motion.div>
        <motion.div className={s.posSpecs} variants={staggerContainer}>
          {SPECS.map((spec) => (
            <motion.div key={spec.label} className={s.posSpec} variants={fadeUp}>
              <div className={s.posSpecLabel}>{spec.label}</div>
              <p className={s.posSpecDesc}>{spec.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
)
