'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { animate, stagger } from 'animejs'
import Image from 'next/image'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

const TESTIMONIALS = [
  {
    q: '"Migrei da Nuvemshop e pago menos da metade. E o suporte responde de verdade."',
    name: 'Carla M.',
    role: 'Moda feminina · Belo Horizonte',
    avatar: '/landing/avatar-carla.svg',
  },
  {
    q: '"Minhas clientes agora escolhem o tamanho e pagam sozinhas. Eu só separo e envio."',
    name: 'Juliana R.',
    role: 'Brechó & moda · Fortaleza',
    avatar: '/landing/avatar-juliana.svg',
  },
  {
    q: '"Subi 120 pares de tênis em 8 minutos, juro. Minha irmã que não manja nada conseguiu."',
    name: 'Diego F.',
    role: 'Calçados · Porto Alegre',
    avatar: '/landing/avatar-diego.svg',
  },
]

export const Testimonials = () => {
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animate(stack.querySelectorAll('img'), {
          scale: [0, 1],
          opacity: [0, 1],
          duration: 600,
          delay: stagger(120, { start: 200 }),
          ease: 'outElastic(1, .6)',
        })
        observer.disconnect()
      },
      { threshold: 0.6 },
    )
    observer.observe(stack)
    return () => observer.disconnect()
  }, [])

  return (
  <section className={s.sec}>
    <div className={s.wrap}>
      <motion.div
        className={s.splitHead}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.div className={s.illusFrame} variants={fadeUp}>
          <Image
            src="/landing/woman-receiving-online-shopping-receipt.svg"
            alt="Cliente recebendo a confirmação do pedido, feliz com a compra"
            width={1017}
            height={895}
          />
        </motion.div>
        <motion.div className={s.splitHeadText} variants={fadeUp}>
          <div className={s.avatarStack} ref={stackRef}>
            {TESTIMONIALS.map((t) => (
              <Image
                key={t.name}
                src={t.avatar}
                alt=""
                width={44}
                height={44}
                style={{ opacity: 0 }}
              />
            ))}
          </div>
          <span className={s.eyebrow}>
            <span className={s.dot} />
            Quem já usa
          </span>
          <h2 className={s.display}>De planilha bagunçada a pedido organizado.</h2>
        </motion.div>
      </motion.div>

      <motion.div
        className={s.testRow}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {TESTIMONIALS.map((t) => (
          <motion.div key={t.name} className={s.testCard} variants={fadeUp}>
            <Image src={t.avatar} alt="" width={60} height={60} className={s.testAvatar} />
            <p className={s.testQuote}>{t.q}</p>
            <div className={s.testName}>{t.name}</div>
            <div className={s.testRole}>{t.role}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
  )
}
