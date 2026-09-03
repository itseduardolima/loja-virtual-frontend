'use client'

import { useEffect, useRef } from 'react'
import s from '../landing.module.css'
import { WhatsappIcon } from '@/assets/icons'

export const BeforeAfter = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const chatsRef = useRef<HTMLDivElement>(null)
  const cardWrapRef = useRef<HTMLDivElement>(null)
  const notchRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const waRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pin+scrub desorienta quem pediu menos movimento — sem fallback de scroll
    // aqui, então simplesmente não anima: a seção renderiza no estado final estático.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: any

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        const bubbles = chatsRef.current
          ? gsap.utils.toArray<HTMLElement>(chatsRef.current.children)
          : []
        const lines = linesRef.current
          ? gsap.utils.toArray<HTMLElement>(linesRef.current.children)
          : []
        const dots = notchRef.current
          ? gsap.utils.toArray<HTMLElement>(notchRef.current.children)
          : []

        gsap.set(cardWrapRef.current, { opacity: 0, scale: 0.86, y: 26 })
        gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })
        gsap.set(lines, { opacity: 0, x: -12 })
        gsap.set(waRef.current, { opacity: 0, y: 8 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: true,
          },
        })

        tl.to(
          bubbles,
          {
            opacity: 0,
            y: -26,
            rotate: (i: number) => (i % 2 === 0 ? -6 : 6),
            stagger: 0.08,
            duration: 0.4,
            ease: 'power1.in',
          },
          0
        )
          .to(
            cardWrapRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
            },
            0.25
          )
          .to(
            dots,
            {
              scale: 1,
              stagger: 0.03,
              duration: 0.25,
            },
            0.45
          )
          .to(
            lines,
            {
              opacity: 1,
              x: 0,
              stagger: 0.07,
              duration: 0.3,
            },
            0.5
          )
          .to(
            waRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
            },
            0.7
          )
      }, sectionRef)
    })()

    return () => {
      ctx?.revert()
    }
  }, [])

  return (
    <section className={s.sec} ref={sectionRef}>
      <div className={s.wrap}>
        <div className={s.secHead}>
          <div className={s.eyebrow}>Antes e depois</div>
          <h2 className={s.h2}>Reconhece essa conversa?</h2>
          <p className={s.lead}>
            Pedido some no meio da conversa, cliente pergunta &ldquo;confirmou?&rdquo;, você anota em três lugares
            diferentes. No Nexo essa bagunça vira um pedido só, com status que você atualiza, e o combinado com o
            cliente continua no WhatsApp.
          </p>
        </div>
      </div>

      <div className={s.baBand}>
        <div className={s.baStage} ref={stageRef}>
          <div className={s.baSide}>
            <span className={s.baSideLabel}>Hoje, no WhatsApp</span>
            <div className={s.baChats} ref={chatsRef}>
              <div className={`${s.baBubble} ${s.baB1}`}>oi ainda tem o vestido rosa M?</div>
              <div className={`${s.baBubble} ${s.baB2}`}>tenho sim! 189,90 c/ frete</div>
              <div className={`${s.baBubble} ${s.baB3}`}>beleza, quero levar</div>
              <div className={`${s.baBubble} ${s.baB4}`}>te chamo pra combinar o pagamento</div>
            </div>
          </div>

          <div className={s.baSide}>
            <span className={s.baSideLabel}>Com o Nexo</span>
            <div className={s.baCardWrap} ref={cardWrapRef}>
              <div className={s.baTicket}>
                <div className={s.baNotch} ref={notchRef}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div className={s.baOrder}>
                  <div className={s.baOrderTop}>
                    <span className={s.baOrderCode}>#A1B2C3</span>
                    <span className={`${s.baTag} ${s.baTagOrange}`}>Em preparação</span>
                  </div>
                  <div className={s.baOrderLines} ref={linesRef}>
                    <div className={s.baOrderLine}>
                      <span>Produto</span>
                      <span>Vestido midi rosa · M</span>
                    </div>
                    <div className={s.baOrderLine}>
                      <span>Cliente</span>
                      <span>Marina Souza</span>
                    </div>
                    <div className={s.baOrderLine}>
                      <span>Total</span>
                      <span>R$ 189,90</span>
                    </div>
                  </div>
                  <div className={s.baWaCta} ref={waRef}>
                    <WhatsappIcon />
                    Combinar entrega com Marina no WhatsApp
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
