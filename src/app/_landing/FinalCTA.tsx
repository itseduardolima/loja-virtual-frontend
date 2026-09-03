'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

export const FinalCTA = () => (
  <div className={s.ctaBand}>
    <svg
      className={s.ctaThreads}
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M-100,120 C 260,40 480,220 760,140 S 1300,40 1560,150"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M-100,220 C 220,280 520,120 820,230 S 1280,280 1560,200"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
    <motion.div
      className={s.wrap}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.h2 className={s.ctaH2} variants={fadeUp}>
        Sua loja no ar hoje.
        <br />
        Do celular mesmo.
      </motion.h2>
      <motion.p className={s.ctaSub} variants={fadeUp}>
        Em 10 minutos você monta sua loja e já começa a vender, do celular mesmo. Pergunte sobre
        período de teste no chat.
      </motion.p>
      <motion.div className={s.ctaBtnWrap} variants={fadeUp}>
        <Link href="/assinatura" className={`${s.btn} ${s.btnLg} ${s.ctaBtn}`}>
          Criar minha loja agora
        </Link>
      </motion.div>
    </motion.div>
  </div>
)
