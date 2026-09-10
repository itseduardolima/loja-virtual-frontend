'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

export const FinalCTA = () => (
  <div className={s.ctaBand}>
    <motion.div
      className={`${s.wrap} ${s.ctaGrid}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.div variants={fadeUp}>
        <h2 className={s.display}>Sua loja no ar hoje. Do celular mesmo.</h2>
        <p className={s.lead}>
          Sem cartão de crédito pra testar. Leva menos tempo do que organizar a tabela de preço.
        </p>
        <Link href="/assinatura" className={`${s.btn} ${s.btnOnband} ${s.btnLg}`}>
          Criar minha loja agora
        </Link>
      </motion.div>
      <motion.div variants={fadeUp}>
        <Image
          src="/landing/announcing-discount.svg"
          alt="Lojista anunciando um cupom de desconto pros clientes"
          width={1500}
          height={1500}
        />
      </motion.div>
    </motion.div>
  </div>
)
