'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { animate } from 'animejs'
import Image from 'next/image'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

export const HowItWorks = () => {
  const knobRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const knob = knobRef.current
    const track = knob?.parentElement
    if (!knob || !track) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const travel = track.clientWidth - knob.clientWidth - 6
        animate(knob, {
          translateX: [0, travel],
          duration: 900,
          delay: 500,
          loopDelay: 1300,
          loop: true,
          alternate: true,
          ease: 'inOutQuad',
        })
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  return (
  <section className={s.sec} id="como-funciona">
    <div className={s.wrap}>
      <motion.div
        className={s.secHead}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <span className={s.eyebrow}>
          <span className={s.dot} />
          Do catálogo ao pedido
        </span>
        <h2 className={s.display}>Tudo que sua loja precisa, em quatro passos.</h2>
      </motion.div>

      <motion.div
        className={s.acardGrid}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.div
          className={`${s.acard} ${s.acardWhite}`}
          style={{ gridColumn: '1/-1' }}
          variants={fadeUp}
        >
          <div className={s.acardHead}>
            <span className={s.acardNum}>01</span>
            <span className={s.acardTitle}>Cadastre seu catálogo em minutos, sem planilha</span>
          </div>
          <div className={s.acardBody}>
            <div className={s.demoToggle}>
              <span className={s.toggleTrack}>
                <span className={s.toggleKnob} ref={knobRef} />
              </span>
              <span className={s.demoToggleLabel}>Catálogo publicado</span>
            </div>
          </div>
          <div className={s.acardFoot}>
            <span className={s.acardFootLabel}>Por quê?</span>
            <p>
              Foto, preço e variação de cada produto num formulário só — sem reenviar tabela toda
              vez que alguém pergunta o preço.
            </p>
          </div>
        </motion.div>

        <motion.div className={`${s.acard} ${s.acardRed}`} variants={fadeUp}>
          <div className={s.acardHead}>
            <span className={s.acardNum}>02</span>
            <span className={s.acardTitle}>Compartilhe o link em qualquer canal</span>
          </div>
          <div className={s.acardBody}>
            <Image
              src="/landing/woman-doing-online-shopping.svg"
              alt="Cliente comprando roupas em duas telas de loja online, lado a lado"
              width={950}
              height={819}
              style={{ width: '100%', maxWidth: 396, margin: '0 auto', display: 'block' }}
            />
          </div>
          <div className={s.acardFoot}>
            <span className={s.acardFootLabel}>Como?</span>
            <p>
              Manda no WhatsApp, no status, no Instagram. O cliente monta o carrinho sozinho, sem
              sair da conversa.
            </p>
          </div>
        </motion.div>

        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} variants={fadeUp}>
          <div className={s.scallop}>
            <svg viewBox="0 0 552 342" preserveAspectRatio="none" fill="none">
              <path
                d="M46 295V47L161 295V47L276 295V47L391 295V47L506 295V47"
                stroke="currentColor"
                strokeWidth="92"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={`${s.acard} ${s.acardWhite}`} style={{ flex: 1, minHeight: 0 }}>
            <div className={s.acardHead}>
              <span className={s.acardNum}>03</span>
              <span className={s.acardTitle}>Categorias prontas pra cada tipo de loja</span>
            </div>
            <div className={s.acardFoot}>
              <span className={s.acardFootLabel}>Mix?</span>
              <p>Roupa, comida, serviço — escolha um modelo de categoria pronto e ajuste do seu jeito.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${s.acard} ${s.acardWhite}`}
          style={{ gridColumn: '1/-1' }}
          variants={fadeUp}
        >
          <div className={s.acardHead}>
            <span className={s.acardNum}>04</span>
            <span className={s.acardTitle}>Organize estoque, pedido e cupom num painel só</span>
          </div>
          <div className={s.acardFoot} style={{ maxWidth: 640 }}>
            <span className={s.acardFootLabel}>Foco?</span>
            <p>Quando vende, o estoque desconta sozinho. Sem planilha cruzada, sem produto vendido em dobro.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
  )
}
